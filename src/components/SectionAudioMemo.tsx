import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Play, Pause, Trash2, Download, Sparkles, AlertCircle } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { saveAudioMemo, getAudioMemo, deleteAudioMemo, exportAudioMemo } from '@/lib/audio/memoStorage'
import { getChordNotes } from '@/lib/music-theory/notes'
import { playPianoChord, playGuitarChord, playMetronomeClick, chordNotesToNoteNames, ensureInstrumentLoaded } from '@/lib/audio/synth'

interface SectionAudioMemoProps {
  sectionId: number
  sectionName: string
  chords: string
  tempo: number
  timeSig: string
  bars: number
  audioMemoId?: string
  audioDuration?: number
  playbackInstrument: 'piano' | 'guitar'
  onMemoChange: (memoId: string | undefined, duration: number | undefined) => void
}

export default function SectionAudioMemo({
  sectionId,
  sectionName,
  chords,
  tempo,
  timeSig,
  bars,
  audioMemoId,
  audioDuration,
  playbackInstrument,
  onMemoChange,
}: SectionAudioMemoProps) {
  // ── Recording State ─────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [playBackingChords, setPlayBackingChords] = useState(true)
  const [playMetronome, setPlayMetronome] = useState(true)
  const playMetronomeRef = useRef(playMetronome)
  const [micError, setMicError] = useState<string | null>(null)

  useEffect(() => {
    playMetronomeRef.current = playMetronome
  }, [playMetronome])

  // ── Playback State ──────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayingWithChords, setIsPlayingWithChords] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(audioDuration || 0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  // ── Refs ────────────────────────────────────────────────────
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const cancelPlaybackRef = useRef<{ cancelled: boolean }>({ cancelled: false })

  // ── Load Existing Memo on Mount / ID change ──────────────────
  useEffect(() => {
    let isMounted = true

    if (audioMemoId) {
      getAudioMemo(audioMemoId).then(memo => {
        if (isMounted && memo) {
          setAudioBlob(memo.blob)
          const url = URL.createObjectURL(memo.blob)
          setAudioUrl(url)
          if (memo.duration) {
            setDuration(memo.duration)
          }
        }
      }).catch(err => {
        console.error('Failed to load audio memo:', err)
      })
    } else {
      setAudioBlob(null)
      setAudioUrl(null)
      setCurrentTime(0)
      setDuration(0)
    }

    return () => {
      isMounted = false
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioMemoId])

  // ── Format Seconds to MM:SS ─────────────────────────────────
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ── Audio Level Meter Loop ──────────────────────────────────
  const startLevelMeter = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.8

      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = ctx
      analyserRef.current = analyser

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateMeter = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        const avg = sum / dataArray.length
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 120)))
        animFrameRef.current = requestAnimationFrame(updateMeter)
      }

      updateMeter()
    } catch (e) {
      console.warn('Web Audio level meter not available:', e)
    }
  }

  const stopLevelMeter = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    setAudioLevel(0)
  }

  // ── Backing Accompaniment Loop (Chords + Metronome Click) ────
  const playAccompanimentLoop = async (cancel: { cancelled: boolean }) => {
    const chordTokens = chords.split(/[\s,]+/).filter(Boolean)
    const beatsPerBar = parseInt(timeSig.split('/')[0]) || 4
    const secondsPerBeat = 60 / tempo
    const msPerBeat = secondsPerBeat * 1000

    await Tone.start()
    if (playBackingChords && chordTokens.length > 0) {
      await ensureInstrumentLoaded(playbackInstrument).catch(() => {})
    }

    const totalSectionBeats = Math.max(1, bars * beatsPerBar)
    const beatsPerChord = chordTokens.length > 0 ? totalSectionBeats / chordTokens.length : totalSectionBeats
    const chordDurationSec = Math.max(0.5, (beatsPerChord * secondsPerBeat) * 0.98)

    let currentBarBeatCount = 0

    while (!cancel.cancelled) {
      if (chordTokens.length > 0 && playBackingChords) {
        for (let i = 0; i < chordTokens.length; i++) {
          if (cancel.cancelled) break
          const notes = getChordNotes(chordTokens[i])
          if (notes.length > 0) {
            const octaved = chordNotesToNoteNames(notes, playbackInstrument)
            if (playbackInstrument === 'piano') {
              playPianoChord(octaved, chordDurationSec).catch(() => {})
            } else {
              playGuitarChord(octaved, chordDurationSec).catch(() => {})
            }
          }

          const chordBeats = Math.max(1, Math.round(beatsPerChord))
          for (let b = 0; b < chordBeats; b++) {
            if (cancel.cancelled) break
            const beatInBar = currentBarBeatCount % beatsPerBar
            if (playMetronomeRef.current) {
              playMetronomeClick(beatInBar === 0)
            }
            currentBarBeatCount++
            await new Promise<void>(r => setTimeout(r, msPerBeat))
          }
        }
      } else {
        // Metronome click only loop
        const beatInBar = currentBarBeatCount % beatsPerBar
        if (playMetronomeRef.current) {
          playMetronomeClick(beatInBar === 0)
        }
        currentBarBeatCount++
        await new Promise<void>(r => setTimeout(r, msPerBeat))
      }
    }
  }

  // ── Start Recording ─────────────────────────────────────────
  const startRecording = async () => {
    setMicError(null)
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      mediaStreamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : 'audio/webm'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: mimeType })
        const memoId = `memo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        const measuredDuration = recordingSeconds || 1

        const memo = {
          id: memoId,
          sectionId,
          blob: finalBlob,
          mimeType,
          duration: measuredDuration,
          createdAt: Date.now(),
          name: `${sectionName} Idea`,
        }

        try {
          await saveAudioMemo(memo)
          setAudioBlob(finalBlob)
          const newUrl = URL.createObjectURL(finalBlob)
          setAudioUrl(newUrl)
          setDuration(measuredDuration)
          onMemoChange(memoId, measuredDuration)
        } catch (err) {
          console.error('Failed to save audio memo to IndexedDB:', err)
        }

        // Clean up tracks
        stream.getTracks().forEach(t => t.stop())
        stopLevelMeter()
      }

      recorder.start(200) // 200ms slice
      setIsRecording(true)
      setRecordingSeconds(0)

      // Start timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1)
      }, 1000)

      // Start level meter
      startLevelMeter(stream)

      // Optionally start backing chords / metronome accompaniment
      if ((playBackingChords && chords.trim()) || playMetronome) {
        const cancel = { cancelled: false }
        cancelPlaybackRef.current = cancel
        playAccompanimentLoop(cancel)
      }
    } catch (err: unknown) {
      console.error('Microphone permission/access error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Could not access microphone.'
      setMicError(errorMsg)
      setIsRecording(false)
    }
  }

  // ── Stop Recording ──────────────────────────────────────────
  const stopRecording = () => {
    cancelPlaybackRef.current.cancelled = true

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    setIsRecording(false)
  }

  // ── Play / Pause Voice Memo ─────────────────────────────────
  const togglePlay = () => {
    if (!audioElementRef.current || !audioUrl) return

    if (isPlaying) {
      audioElementRef.current.pause()
      setIsPlaying(false)
      setIsPlayingWithChords(false)
      cancelPlaybackRef.current.cancelled = true
    } else {
      audioElementRef.current.play()
      setIsPlaying(true)
    }
  }

  // ── Play Voice Memo Simultaneous with Chords ────────────────
  const togglePlayWithChords = async () => {
    if (!audioElementRef.current || !audioUrl) return

    if (isPlayingWithChords) {
      audioElementRef.current.pause()
      setIsPlaying(false)
      setIsPlayingWithChords(false)
      cancelPlaybackRef.current.cancelled = true
    } else {
      audioElementRef.current.currentTime = 0
      audioElementRef.current.play()
      setIsPlaying(true)
      setIsPlayingWithChords(true)

      const cancel = { cancelled: false }
      cancelPlaybackRef.current = cancel

      if (chords.trim()) {
        playAccompanimentLoop(cancel)
      }
    }
  }

  // ── Stop Audio Playback on End ──────────────────────────────
  const handleAudioEnded = () => {
    setIsPlaying(false)
    setIsPlayingWithChords(false)
    setCurrentTime(0)
    cancelPlaybackRef.current.cancelled = true
  }

  const handleTimeUpdate = () => {
    if (audioElementRef.current) {
      setCurrentTime(audioElementRef.current.currentTime)
      if (audioElementRef.current.duration && !isNaN(audioElementRef.current.duration)) {
        setDuration(Math.round(audioElementRef.current.duration))
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value)
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    }
  }

  // ── Delete Memo ─────────────────────────────────────────────
  const handleDeleteMemo = async () => {
    if (!window.confirm('Delete this voice memo?')) return

    if (audioElementRef.current) {
      audioElementRef.current.pause()
    }
    cancelPlaybackRef.current.cancelled = true
    setIsPlaying(false)
    setIsPlayingWithChords(false)

    if (audioMemoId) {
      try {
        await deleteAudioMemo(audioMemoId)
      } catch (e) {
        console.error('Failed to delete memo from DB:', e)
      }
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudioBlob(null)
    setAudioUrl(null)
    setCurrentTime(0)
    setDuration(0)
    onMemoChange(undefined, undefined)
  }

  // ── Download Memo ───────────────────────────────────────────
  const handleDownload = () => {
    if (!audioBlob) return
    const filename = `${sectionName.toLowerCase().replace(/\s+/g, '-')}-voice-memo.webm`
    exportAudioMemo(audioBlob, filename)
  }

  return (
    <div className="rounded-xl border border-studio-border/70 bg-studio-surface/60 p-4 space-y-3">
      {/* Hidden native audio element */}
      {audioUrl && (
        <audio
          ref={audioElementRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          onTimeUpdate={handleTimeUpdate}
          className="hidden"
        />
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={twMerge(
            'p-1.5 rounded-lg border flex items-center justify-center transition-colors',
            isRecording
              ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
              : audioMemoId
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-studio-bg border-studio-border text-studio-muted'
          )}>
            <Mic size={14} />
          </div>
          <div>
            <span className="text-xs font-semibold text-studio-text">Voice Memo & Melody Scratchpad</span>
            <p className="text-[10px] text-studio-muted">
              {isRecording
                ? 'Recording vocal idea...'
                : audioMemoId
                ? `Voice note recorded (${formatTime(duration)})`
                : 'Hum or sing an idea over this section'}
            </p>
          </div>
        </div>

        {/* Status badges */}
        {audioMemoId && !isRecording && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Saved
          </span>
        )}
      </div>

      {/* Mic error warning */}
      {micError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* ── Active Recording Mode ─────────────────────────────── */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* Pulsing indicator + timer */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
                  <div className="w-3 h-3 rounded-full bg-red-500 relative" />
                </div>
                <span className="font-mono text-base font-bold text-red-400">
                  {formatTime(recordingSeconds)}
                </span>
                <span className="text-[11px] font-mono text-studio-muted">
                  {tempo} BPM · {timeSig}
                </span>
              </div>

              {/* Action buttons while recording */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlayMetronome(p => !p)}
                  className={twMerge(
                    'flex items-center gap-1 h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all select-none',
                    playMetronome
                      ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                      : 'border-studio-border bg-studio-bg text-studio-muted'
                  )}
                  title="Toggle metronome click"
                >
                  ⏱️ Click {playMetronome ? 'ON' : 'OFF'}
                </button>

                {/* Stop & Save button */}
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 transition-all"
                >
                  <Square size={12} fill="currentColor" /> Stop & Save
                </button>
              </div>
            </div>

            {/* Live Audio Level Visualizer Bars */}
            <div className="flex items-end justify-center gap-1 h-10 px-2 bg-studio-bg/60 rounded-lg border border-studio-border/50">
              {Array.from({ length: 24 }).map((_, i) => {
                // Vary bar heights based on live audioLevel and index
                const offset = Math.sin((i / 24) * Math.PI)
                const barHeight = Math.max(12, Math.min(100, audioLevel * offset * 1.5 + (Math.random() * 8)))
                return (
                  <div
                    key={i}
                    style={{ height: `${barHeight}%` }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-red-500 to-amber-400 transition-all duration-75"
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Blank State / Record Starter ──────────────────────── */}
      {!isRecording && !audioMemoId && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={startRecording}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all shrink-0"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              Record Voice Memo
            </button>

            {/* Metronome option */}
            <label className="flex items-center gap-1.5 text-[11px] text-studio-muted select-none cursor-pointer hover:text-studio-text transition-colors">
              <input
                type="checkbox"
                checked={playMetronome}
                onChange={e => setPlayMetronome(e.target.checked)}
                className="rounded border-studio-border bg-studio-bg text-amber-500 focus:ring-0 focus:outline-none"
              />
              <span>⏱️ Metronome click ({tempo} BPM)</span>
            </label>

            {/* Backing chords option */}
            {chords.trim() && (
              <label className="flex items-center gap-1.5 text-[11px] text-studio-muted select-none cursor-pointer hover:text-studio-text transition-colors">
                <input
                  type="checkbox"
                  checked={playBackingChords}
                  onChange={e => setPlayBackingChords(e.target.checked)}
                  className="rounded border-studio-border bg-studio-bg text-emerald-500 focus:ring-0 focus:outline-none"
                />
                <span>Play backing chords ({playbackInstrument === 'piano' ? '🎹' : '🎸'})</span>
              </label>
            )}
          </div>
          <span className="text-[10px] text-studio-muted/70 italic shrink-0">
            Uses microphone · saved locally
          </span>
        </div>
      )}

      {/* ── Recorded Memo Player ──────────────────────────────── */}
      {!isRecording && audioMemoId && audioUrl && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-studio-bg/60 border border-studio-border/70">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className={twMerge(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0 font-semibold',
                isPlaying && !isPlayingWithChords
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
              )}
              title={isPlaying ? 'Pause' : 'Play Voice Memo'}
            >
              {isPlaying && !isPlayingWithChords ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            </button>

            {/* Scrubber & Time */}
            <div className="flex-1 min-w-0 space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-studio-border rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-studio-muted">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play with Chords Button */}
            {chords.trim() && (
              <button
                onClick={togglePlayWithChords}
                className={twMerge(
                  'h-8 px-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0',
                  isPlayingWithChords
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25 animate-pulse'
                    : 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                )}
                title="Play voice memo simultaneously with section chords"
              >
                <Sparkles size={12} />
                <span className="hidden sm:inline">Play with Chords</span>
              </button>
            )}

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg text-studio-muted hover:text-studio-text hover:bg-studio-surface border border-transparent hover:border-studio-border transition-all shrink-0"
              title="Download audio file"
            >
              <Download size={13} />
            </button>

            {/* Delete / Re-record Button */}
            <button
              onClick={handleDeleteMemo}
              className="p-2 rounded-lg text-studio-muted/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all shrink-0"
              title="Delete and re-record"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
