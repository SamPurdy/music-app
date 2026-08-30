import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Save, Upload, Download, Layers, Check, X, FilePlus2, Play, Square, Mic } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { NOTE_NAMES, transposeChordName, getChordNotes } from '@/lib/music-theory/notes'
import { playPianoChord, playGuitarChord, playMetronomeClick, chordNotesToNoteNames, ensureInstrumentLoaded } from '@/lib/audio/synth'
import { exportSongToMidi } from '@/lib/midi/export'
import ChordTooltip from './ChordTooltip'
import SectionAudioMemo from './SectionAudioMemo'

const SECTION_TYPES = {
  intro:        { label: 'Intro',        color: 'bg-slate-500/20  text-slate-200  border-slate-400/40'      },
  verse:        { label: 'Verse',        color: 'bg-blue-500/20   text-blue-200   border-blue-400/40'       },
  'pre-chorus': { label: 'Pre-Ch.',      color: 'bg-cyan-500/20   text-cyan-200   border-cyan-400/40'       },
  chorus:       { label: 'Chorus',       color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'  },
  bridge:       { label: 'Bridge',       color: 'bg-purple-500/20 text-purple-200 border-purple-400/40'     },
  instrumental: { label: 'Instrumental', color: 'bg-amber-500/20  text-amber-200  border-amber-400/40'      },
  outro:        { label: 'Outro',        color: 'bg-slate-500/20  text-slate-200  border-slate-400/40'      },
} as const

type SectionType = keyof typeof SECTION_TYPES

interface Section {
  id: number
  name: string
  type: SectionType
  bars: number
  chords: string
  lyrics: string
  audioMemoId?: string
  audioDuration?: number
}

const KEYS = NOTE_NAMES

const DEFAULT_SECTIONS: Section[] = []

interface Props {
  onMetaChange?: (meta: { key: string; tempo: number; timeSig: string }) => void
  pendingProgression?: { key: string; chords: string[] } | null
  onClearPending?: () => void
}

export default function SongStructureBuilder({ onMetaChange, pendingProgression, onClearPending }: Props) {
  const nextIdRef = useRef(1)
  const [songKey, setSongKey]   = useState('C')
  const [tempo, setTempo]       = useState(120)
  const [timeSig, setTimeSig]   = useState('4/4')
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [title, setTitle]       = useState('Untitled Song')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [pendingSectionType, setPendingSectionType] = useState<SectionType>('verse')
  const [transposeSemitones, setTransposeSemitones] = useState(0)
  const [capoFret, setCapoFret] = useState(0)
  const [chordTooltipInstrument, setChordTooltipInstrument] = useState<'guitar' | 'piano'>('guitar')

  // ── Playback state ──────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingSectionId, setPlayingSectionId] = useState<number | null>(null)
  const [playingChordIdx, setPlayingChordIdx] = useState<number | null>(null)
  const [playbackInstrument, setPlaybackInstrument] = useState<'piano' | 'guitar'>('piano')
  const [metronomeEnabled, setMetronomeEnabled] = useState(true)
  const [activeBeat, setActiveBeat] = useState<number | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const metronomeRef = useRef(metronomeEnabled)
  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false })

  useEffect(() => {
    metronomeRef.current = metronomeEnabled
  }, [metronomeEnabled])
  
  // Saved songs from localStorage
  const [savedSongs, setSavedSongs] = useState<Song[]>(() => {
    try {
      const stored = localStorage.getItem('sws_saved_songs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Song data structure for localStorage
  interface Song {
    id: string
    title: string
    key: string
    tempo: number
    timeSig: string
    sections: Section[]
    transposeSemitones: number
    capoFret: number
    createdAt: number
    updatedAt: number
  }

  useEffect(() => {
    const idx = NOTE_NAMES.indexOf(songKey as any)
    const dk = idx === -1 ? songKey : NOTE_NAMES[((idx + transposeSemitones) % 12 + 12) % 12]
    onMetaChange?.({ key: dk, tempo, timeSig })
  }, [songKey, transposeSemitones, tempo, timeSig, onMetaChange])

  // ── Transpose & Capo helpers ─────────────────────────────────
  const totalDisplayOffset = transposeSemitones - capoFret

  const getDisplayChords = (originalChords: string): string[] => {
    const tokens = originalChords.split(/[\s,]+/).filter(Boolean)
    if (totalDisplayOffset === 0) return tokens
    return tokens.map(c => transposeChordName(c, totalDisplayOffset))
  }

  const getSoundingChords = (originalChords: string): string[] => {
    const tokens = originalChords.split(/[\s,]+/).filter(Boolean)
    if (transposeSemitones === 0) return tokens
    return tokens.map(c => transposeChordName(c, transposeSemitones))
  }

  const displayKey = (() => {
    const idx = NOTE_NAMES.indexOf(songKey as any)
    if (idx === -1) return songKey
    return NOTE_NAMES[((idx + transposeSemitones) % 12 + 12) % 12]
  })()

  const capoShapeKey = (() => {
    const idx = NOTE_NAMES.indexOf(songKey as any)
    if (idx === -1) return songKey
    return NOTE_NAMES[((idx + totalDisplayOffset) % 12 + 12) % 12]
  })()

  const updateSection = (id: number, patch: Partial<Section>) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const addSection = (type: SectionType) => {
    const meta = SECTION_TYPES[type]
    setSections(prev => [...prev, { id: nextIdRef.current++, name: meta.label, type, bars: 8, chords: '', lyrics: '' }])
    setExpandedIds(prev => new Set(prev).add(nextIdRef.current - 1))
  }

  const acceptPendingProgression = () => {
    if (!pendingProgression) return
    const meta = SECTION_TYPES[pendingSectionType]
    const newId = nextIdRef.current++
    setSections(prev => [...prev, {
      id: newId,
      name: meta.label,
      type: pendingSectionType,
      bars: Math.max(2, Math.ceil(pendingProgression.chords.length / 2) * 2),
      chords: pendingProgression.chords.join('  '),
      lyrics: '',
    }])
    setExpandedIds(prev => new Set(prev).add(newId))
    onClearPending?.()
  }

  const removeSection = (id: number) => {
    setSections(prev => prev.filter(s => s.id !== id))
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }



  // ── Playback ────────────────────────────────────────────────
  const playSong = async () => {
    if (isPlaying) return
    const sectionsWithChords = sections.filter(s => s.chords.trim())
    if (sectionsWithChords.length === 0) return

    await Tone.start()
    try {
      await ensureInstrumentLoaded(playbackInstrument)
    } catch (e) {
      console.error('Failed to load instrument:', e)
    }

    const cancel = { cancelled: false }
    cancelRef.current = cancel
    setIsPlaying(true)
    setPlayingSectionId(null)
    setPlayingChordIdx(null)
    setActiveBeat(null)

    const beatsPerBar = parseInt(timeSig.split('/')[0]) || 4
    const secondsPerBeat = 60 / tempo
    const msPerBeat = secondsPerBeat * 1000

    let barBeatCount = 0

    for (const section of sectionsWithChords) {
      if (cancel.cancelled) break
      const chords = getSoundingChords(section.chords)
      if (chords.length === 0) continue

      setPlayingSectionId(section.id)

      // Total beats in this section
      const totalSectionBeats = Math.max(1, section.bars * beatsPerBar)
      const beatsPerChord = totalSectionBeats / chords.length
      const chordDurationSec = Math.max(0.5, (beatsPerChord * secondsPerBeat) * 0.98)

      for (let i = 0; i < chords.length; i++) {
        if (cancel.cancelled) break
        setPlayingChordIdx(i)

        const notes = getChordNotes(chords[i])
        if (notes.length > 0) {
          const octaved = chordNotesToNoteNames(notes, playbackInstrument)
          if (playbackInstrument === 'piano') {
            playPianoChord(octaved, chordDurationSec).catch(() => {})
          } else {
            playGuitarChord(octaved, chordDurationSec).catch(() => {})
          }
        }

        // Sub-beat loop for the exact duration of this chord
        const numBeats = Math.max(1, Math.round(beatsPerChord))
        for (let b = 0; b < numBeats; b++) {
          if (cancel.cancelled) break
          const beatInBar = barBeatCount % beatsPerBar
          setActiveBeat(beatInBar + 1)

          if (metronomeRef.current) {
            playMetronomeClick(beatInBar === 0)
          }

          barBeatCount++
          await new Promise<void>(r => setTimeout(r, msPerBeat))
        }
      }
    }

    if (!cancel.cancelled) {
      // Small tail so last chord rings out
      await new Promise<void>(r => setTimeout(r, 800))
    }

    setIsPlaying(false)
    setPlayingSectionId(null)
    setPlayingChordIdx(null)
    setActiveBeat(null)
  }

  const stopPlayback = () => {
    cancelRef.current.cancelled = true
    setIsPlaying(false)
    setPlayingSectionId(null)
    setPlayingChordIdx(null)
    setActiveBeat(null)
  }

  // ── Save & Export Handlers ─────────────────────────────────
  const saveToLocalStorage = () => {
    const songTitle = title.trim() || 'Untitled Song'
    const newSong: Song = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: songTitle,
      key: songKey,
      tempo,
      timeSig,
      sections,
      transposeSemitones,
      capoFret,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const songs = [...savedSongs, newSong]
    setSavedSongs(songs)
    localStorage.setItem('sws_saved_songs', JSON.stringify(songs))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const exportCurrentSongJson = () => {
    const data = {
      app: 'Soundwave Studio',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      title: title.trim() || 'Untitled Song',
      key: songKey,
      tempo,
      timeSig,
      transposeSemitones,
      capoFret,
      sections,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(title || 'song').trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportSavedSongJson = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation()
    const data = {
      app: 'Soundwave Studio',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      title: song.title,
      key: song.key,
      tempo: song.tempo,
      timeSig: song.timeSig,
      transposeSemitones: song.transposeSemitones ?? 0,
      capoFret: song.capoFret ?? 0,
      sections: song.sections,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(song.title || 'song').trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAllSongsBackup = () => {
    if (savedSongs.length === 0) return
    const data = {
      app: 'Soundwave Studio',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      totalSongs: savedSongs.length,
      songs: savedSongs,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `soundwave-songs-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadFromStorage = (songId: string) => {
    const index = savedSongs.findIndex(s => s.id === songId)
    if (index === -1) return
    
    const song = savedSongs[index]
    setTitle(song.title)
    setSongKey(song.key)
    setTempo(song.tempo)
    setTimeSig(song.timeSig)
    setTransposeSemitones(song.transposeSemitones ?? 0)
    setCapoFret(song.capoFret ?? 0)
    
    // Reinitialize refs for new sections
    nextIdRef.current = Math.max(...song.sections.map(s => s.id), 0) + 1
    
    // Reset expanded state and expand all sections
    const allExpandedIds = new Set<number>()
    song.sections.forEach(s => allExpandedIds.add(s.id))
    setExpandedIds(allExpandedIds)
    
    // Restore all sections completely (replace, don't merge)
    setSections(song.sections.map((s: Section) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      bars: s.bars,
      chords: s.chords,
      lyrics: s.lyrics,
      audioMemoId: s.audioMemoId,
      audioDuration: s.audioDuration,
    })))
  }

  const newSong = () => {
    if (!window.confirm('Start a new song? Any unsaved changes will be lost.')) return
    setTitle('Untitled Song')
    setSongKey('C')
    setTempo(120)
    setTimeSig('4/4')
    setTransposeSemitones(0)
    setCapoFret(0)
    nextIdRef.current = DEFAULT_SECTIONS.length + 1
    setSections(DEFAULT_SECTIONS.map(s => ({ ...s })))
    setExpandedIds(new Set())
  }

  const deleteSavedSong = (songId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const index = savedSongs.findIndex(s => s.id === songId)
    if (index === -1) return
    
    const newSaved = [...savedSongs]
    newSaved.splice(index, 1)
    setSavedSongs(newSaved)
    localStorage.setItem('sws_saved_songs', JSON.stringify(newSaved))
  }

  const loadSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string)

        // Case 1: Multi-song backup file
        if (Array.isArray(data.songs) && data.songs.length > 0) {
          const imported = data.songs.filter((s: any) => s.title && Array.isArray(s.sections))
          if (imported.length > 0) {
            const combined = [...savedSongs, ...imported]
            setSavedSongs(combined)
            localStorage.setItem('sws_saved_songs', JSON.stringify(combined))
            alert(`Successfully restored ${imported.length} song(s) into your Saved Songs library!`)
            return
          }
        }

        // Case 2: Single song file
        if (data.title) setTitle(data.title)
        if (data.key) setSongKey(data.key)
        if (data.tempo) setTempo(data.tempo)
        if (data.timeSig) setTimeSig(data.timeSig)
        setTransposeSemitones(data.transposeSemitones ?? 0)
        setCapoFret(data.capoFret ?? 0)
        if (data.sections && Array.isArray(data.sections)) {
          nextIdRef.current = Math.max(...data.sections.map((s: any) => s.id || 0), 0) + 1
          setSections(data.sections.map((s: Section) => ({
            id: s.id,
            name: s.name,
            type: s.type,
            bars: s.bars,
            chords: s.chords,
            lyrics: s.lyrics,
            audioMemoId: s.audioMemoId,
            audioDuration: s.audioDuration,
          })))
          setExpandedIds(new Set(data.sections.map((s: Section) => s.id)))
        }
      } catch {
        alert('Could not read JSON file. Please ensure it is a valid Soundwave Studio JSON song file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const totalBars = sections.reduce((acc, s) => acc + s.bars, 0)

  // Sort saved songs by update time (newest first)
  const sortedSavedSongs = [...savedSongs].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="w-full space-y-4">

      {/* Pending progression banner */}
      <AnimatePresence>
        {pendingProgression && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                  <Layers size={13} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-studio-text">Progression from Chord Lab</p>
                  <p className="text-[10px] text-studio-muted mt-0.5 font-mono truncate">
                    {pendingProgression.key} · {pendingProgression.chords.join('  ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={pendingSectionType}
                    onChange={e => setPendingSectionType(e.target.value as SectionType)}
                    className="h-8 px-2 text-xs font-medium rounded-lg border border-studio-border bg-studio-bg text-studio-text appearance-none focus:outline-none focus:border-emerald-500/60 transition-all"
                  >
                    {(Object.keys(SECTION_TYPES) as SectionType[]).map(t => (
                      <option key={t} value={t}>{SECTION_TYPES[t].label}</option>
                    ))}
                  </select>
                  <button
                    onClick={acceptPendingProgression}
                    className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Check size={11} />
                    Add Section
                  </button>
                  <button
                    onClick={onClearPending}
                    className="h-8 w-8 rounded-lg text-studio-muted hover:text-studio-text hover:bg-studio-surface border border-transparent hover:border-studio-border transition-all flex items-center justify-center"
                    title="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Saved songs panel */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-studio-text">Saved Songs</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-studio-muted font-mono">{savedSongs.length} saved</span>
            {savedSongs.length > 0 && (
              <button
                onClick={exportAllSongsBackup}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-studio-border bg-studio-bg hover:bg-studio-surface text-[11px] font-medium text-studio-muted hover:text-studio-text transition-all"
                title="Backup all saved songs to a single JSON file"
              >
                <Download size={12} />
                Backup All
              </button>
            )}
            <button
              id="new-song-btn"
              onClick={newSong}
              className="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-studio-accent/40 bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20 text-[11px] font-semibold transition-all"
              title="Start a new blank song"
            >
              <FilePlus2 size={12} />
              New Song
            </button>
          </div>
        </div>
        
        {savedSongs.length === 0 ? (
          <p className="text-xs text-studio-muted/70 italic">No saved songs yet. Click "Save to Library" or "Export JSON" to save your song.</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {sortedSavedSongs.map(song => (
              <div key={song.id} className="group flex items-center gap-3 p-3 rounded-lg border border-studio-border bg-studio-bg/50 hover:bg-studio-bg transition-colors">
                <span className="text-sm font-semibold text-studio-accent truncate flex-1">{song.title}</span>
                <span className="text-[10px] text-studio-muted font-mono whitespace-nowrap">{song.key} • {song.tempo}BPM</span>
                <button 
                  onClick={() => loadFromStorage(song.id)}
                  className="shrink-0 p-2 rounded text-studio-muted hover:text-studio-accent hover:bg-studio-accent/10 transition-all border border-transparent hover:border-studio-accent/20"
                  title="Load this song"
                >
                  <Upload size={14} />
                </button>
                <button 
                  onClick={(e) => exportSavedSongJson(song, e)}
                  className="shrink-0 p-2 rounded text-studio-muted hover:text-emerald-400 hover:bg-emerald-400/10 transition-all border border-transparent hover:border-emerald-400/20"
                  title="Export this song as JSON"
                >
                  <Download size={14} />
                </button>
                <button 
                  onClick={(e) => deleteSavedSong(song.id, e)}
                  className="shrink-0 p-2 rounded text-studio-muted/60 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-40 group-hover:opacity-100 border border-transparent hover:border-red-400/20"
                  title="Delete from saved list"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Song metadata card */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-studio-text">Song Editor</h3>
          </div>
          <button 
            onClick={() => {
              if (expandedIds.size === sections.length) {
                setExpandedIds(new Set())
              } else if (expandedIds.size === 0) {
                setExpandedIds(new Set(sections.map(s => s.id)))
              } else {
                // Toggle between all expanded and current state
                const toggleAll = new Set<number>()
                sections.forEach(s => toggleAll.add(s.id))
                setExpandedIds(toggleAll)
              }
            }}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-studio-border bg-studio-bg text-xs font-semibold text-studio-muted hover:text-studio-accent hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all flex items-center gap-1.5"
          >
            {expandedIds.size === 0 
              ? 'Expand All' 
              : expandedIds.size === sections.length 
                ? 'Collapse All' 
                : 'Toggle Sections'}
            {expandedIds.size === 0 && <ChevronRight size={12} />}
            {expandedIds.size === sections.length && <ChevronDown size={12} />}
            {expandedIds.size > 0 && expandedIds.size < sections.length && <GripVertical size={12} className="rotate-90" />}
          </button>
        </div>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 bg-transparent text-base font-semibold text-studio-text placeholder-studio-muted focus:outline-none min-w-0"
          placeholder="Song title…"
        />

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block mb-1.5 text-[11px] uppercase tracking-widest text-studio-muted">Key</label>
            <select
              value={songKey}
              onChange={e => setSongKey(e.target.value)}
              className="h-9 px-3 text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all appearance-none"
            >
              {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] uppercase tracking-widest text-studio-muted">BPM</label>
            <input type="number" value={tempo} onChange={e => setTempo(Number(e.target.value) || 120)} className="w-24 h-9 px-3 text-center text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all" />
          </div>
          <div>
            <label className="block mb-1.5 text-[11px] uppercase tracking-widest text-studio-muted">Time</label>
            <select value={timeSig} onChange={e => setTimeSig(e.target.value)} className="h-9 px-3 text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all appearance-none">
              {['4/4','3/4','6/8','5/4','7/8'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="ml-auto flex items-end">
            <span className="text-[12px] text-studio-muted font-mono">{totalBars} bars total</span>
          </div>
        </div>

      </div>

      {/* Transpose & Capo */}
      <div className="rounded-xl border border-studio-border bg-studio-surface/50 p-4 space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[11px] uppercase tracking-widest text-studio-muted shrink-0">Transpose</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTransposeSemitones(prev => prev - 1)}
              className="h-8 w-8 rounded-lg border border-studio-border bg-studio-surface/40 text-sm font-bold text-studio-muted hover:text-studio-accent hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all flex items-center justify-center"
            >
              −
            </button>
            <span className={twMerge(
              'h-8 min-w-[3rem] rounded-lg border px-3 flex items-center justify-center text-xs font-mono font-bold transition-all',
              transposeSemitones === 0
                ? 'border-studio-border bg-studio-bg text-studio-muted'
                : 'border-studio-accent/40 bg-studio-accent/10 text-studio-accent'
            )}>
              {transposeSemitones > 0 ? `+${transposeSemitones}` : transposeSemitones}
            </span>
            <button
              onClick={() => setTransposeSemitones(prev => prev + 1)}
              className="h-8 w-8 rounded-lg border border-studio-border bg-studio-surface/40 text-sm font-bold text-studio-muted hover:text-studio-accent hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all flex items-center justify-center"
            >
              +
            </button>
            {(transposeSemitones !== 0 || capoFret > 0) && (
              <button
                onClick={() => { setTransposeSemitones(0); setCapoFret(0) }}
                className="h-8 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[11px] font-semibold hover:bg-amber-500/20 transition-all flex items-center gap-1.5 ml-1"
              >
                ↺ Reset
              </button>
            )}
          </div>

          <div className="h-6 w-px bg-studio-border/60 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-studio-muted shrink-0">Capo</span>
            <select
              value={capoFret}
              onChange={e => setCapoFret(Number(e.target.value))}
              className="h-8 px-2 text-xs font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all appearance-none"
            >
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>{i === 0 ? 'None' : `Fret ${i}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Info bar — shows sounding key & capo shape key when active */}
        {(transposeSemitones !== 0 || capoFret > 0) && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-studio-muted pt-2 border-t border-studio-border/30">
            <span>Sounding key: <strong className="text-studio-text">{displayKey}</strong></span>
            {capoFret > 0 && (
              <>
                <span>·</span>
                <span>Capo shapes: <strong className="text-studio-accent">{capoShapeKey}</strong></span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Section list */}
      <div className="space-y-2 max-h-[calc(100vh-520px)] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {sections.map((section) => {
            const meta = SECTION_TYPES[section.type]
            const isExpanded = expandedIds.has(section.id)
            return (
              <motion.div
                key={section.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className={twMerge(
                  'rounded-xl border bg-studio-surface transition-all',
                  draggedId === section.id ? 'opacity-50' : '',
                  playingSectionId === section.id
                    ? 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'border-studio-border'
                )}
                draggable
                onDragStart={() => setDraggedId(section.id)}
                onDragOver={e => { e.preventDefault() }}
                onDrop={() => {
                  if (draggedId === null || draggedId === section.id) return
                  setSections(prev => {
                    const from = prev.findIndex(s => s.id === draggedId)
                    const to = prev.findIndex(s => s.id === section.id)
                    const next = [...prev]
                    const [item] = next.splice(from, 1)
                    next.splice(to, 0, item)
                    return next
                  })
                  setDraggedId(null)
                }}
                onDragEnd={() => setDraggedId(null)}
              >
                {/* Section header row */}
                <div className="group flex items-center gap-3 p-4 hover:border-studio-border/80 hover:-translate-y-px transition-all">
                  <GripVertical size={16} className="text-studio-muted group-hover:text-studio-text cursor-grab shrink-0" />
                  <span className={twMerge('text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border shrink-0', meta.color)}>{meta.label}</span>
                  <input
                    value={section.name}
                    onChange={e => updateSection(section.id, { name: e.target.value })}
                    className="flex-1 bg-transparent text-base font-medium text-studio-text focus:outline-none min-w-0"
                  />
                  {section.audioMemoId && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0" title="Voice memo attached">
                      <Mic size={10} />
                      {Math.floor((section.audioDuration || 0) / 60)}:{Math.floor((section.audioDuration || 0) % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-studio-muted font-mono shrink-0">
                    <input type="number" min={1} max={64} value={section.bars} onChange={e => updateSection(section.id, { bars: Number(e.target.value) || 4 })} className="w-12 text-center bg-studio-bg border border-studio-border rounded px-1.5 py-0.5 text-[11px] font-mono text-studio-muted focus:outline-none focus:border-emerald-500/60" />
                    <span>bars</span>
                  </div>
                  <button
                    onClick={() => setExpandedIds(prev => {
                      const next = new Set(prev)
                      if (next.has(section.id)) {
                        next.delete(section.id)
                      } else {
                        next.add(section.id)
                      }
                      return next
                    })}
                    className="p-1.5 rounded text-studio-muted/50 hover:text-studio-accent hover:bg-studio-accent/10 transition-all shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <button onClick={() => removeSection(section.id)} className="p-1.5 rounded text-studio-muted/60 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-40 group-hover:opacity-100 shrink-0 border border-transparent hover:border-red-400/20"><Trash2 size={13} /></button>
                </div>

                {/* Expanded panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key={`expand-${section.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-t border-studio-border/40"
                    >
                      <div className="p-5 space-y-4 bg-studio-bg/30">
                        {/* Chord input */}
                        <div>
                          <label className="text-[11px] uppercase tracking-widest text-studio-muted mb-2 block">Chords{totalDisplayOffset !== 0 && <span className="text-studio-muted/50 normal-case tracking-normal ml-1">(original)</span>}</label>
                          <input
                            value={section.chords}
                            onChange={e => updateSection(section.id, { chords: e.target.value })}
                            placeholder="C  Am  F  G"
                            className="w-full h-10 px-4 text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-studio-accent/60 transition-all placeholder-studio-muted/40"
                          />
                        </div>
                        {/* Chord pills with hover shape tooltip */}
                        {section.chords.trim() && (
                          <div className="flex flex-wrap gap-2 items-center">
                            {getDisplayChords(section.chords).map((chord, i) => (
                              <ChordTooltip
                                key={i}
                                chord={chord}
                                instrument={chordTooltipInstrument}
                                onInstrumentChange={setChordTooltipInstrument}
                              >
                                <span
                                  className={twMerge(
                                    'px-3 py-1.5 rounded-lg border font-mono text-sm transition-all hover:scale-105 hover:border-studio-accent/70 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]',
                                    playingSectionId === section.id && playingChordIdx === i
                                      ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-300 scale-105 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                      : 'border-studio-accent/30 bg-studio-accent/10 text-studio-accent'
                                  )}
                                  title="Hover to view chord shape"
                                >
                                  {chord}
                                </span>
                              </ChordTooltip>
                            ))}
                          </div>
                        )}
                        {/* Lyrics (hidden for instrumental sections) */}
                        {section.type !== 'instrumental' && (
                        <div>
                          <label className="text-[11px] uppercase tracking-widest text-studio-muted mb-2 block">Lyrics <span className="text-studio-muted/50 normal-case tracking-normal">(one line per bar)</span></label>
                          <textarea
                            value={section.lyrics}
                            onChange={e => updateSection(section.id, { lyrics: e.target.value })}
                            placeholder="Enter lyrics here…"
                            rows={5}
                            className="w-full px-4 py-3 text-sm rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-studio-accent/60 transition-all resize-none font-mono placeholder-studio-muted/40 leading-6"
                          />
                        </div>
                        )}

                        {/* Voice Memo & Audio Scratchpad */}
                        <SectionAudioMemo
                          sectionId={section.id}
                          sectionName={section.name}
                          chords={getSoundingChords(section.chords).join('  ')}
                          tempo={tempo}
                          timeSig={timeSig}
                          bars={section.bars}
                          audioMemoId={section.audioMemoId}
                          audioDuration={section.audioDuration}
                          playbackInstrument={playbackInstrument}
                          onMemoChange={(memoId, dur) => {
                            updateSection(section.id, {
                              audioMemoId: memoId,
                              audioDuration: dur
                            })
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Empty state */}
          {sections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-studio-border text-center"
            >
              <Plus size={24} className="text-studio-muted/50 mb-3" />
              <p className="text-sm text-studio-muted">No sections yet</p>
              <p className="text-[11px] text-studio-muted/60 mt-1">Use the Add Section buttons below to build your song structure</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add section row */}
      <div className="border-t border-studio-border/50 pt-4 space-y-3">
        <p className="text-[11px] uppercase tracking-widest text-studio-muted">Add section</p>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(SECTION_TYPES) as SectionType[]).map(type => (
            <button key={type} onClick={() => addSection(type)} className={twMerge('flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all hover:-translate-y-px', SECTION_TYPES[type].color)}>
              <Plus size={12} /> {SECTION_TYPES[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Playback transport ────────────────────────────────── */}
      {sections.some(s => s.chords.trim()) && (
        <div className={twMerge(
          'rounded-xl border p-3 transition-all',
          isPlaying
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : 'border-studio-border bg-studio-surface/50'
        )}>
          <div className="flex items-center gap-3">

            {/* Play / Stop */}
            <button
              onClick={isPlaying ? stopPlayback : playSong}
              className={twMerge(
                'flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all shrink-0',
                isPlaying
                  ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              )}
            >
              {isPlaying
                ? <><Square size={12} fill="currentColor" /> Stop</>
                : <><Play size={12} fill="currentColor" /> Play Song</>}
            </button>

            {/* Instrument toggle */}
            <div className="flex rounded-lg border border-studio-border overflow-hidden shrink-0">
              {(['piano', 'guitar'] as const).map(inst => (
                <button
                  key={inst}
                  onClick={() => setPlaybackInstrument(inst)}
                  disabled={isPlaying}
                  className={twMerge(
                    'px-2.5 py-1.5 text-[11px] font-semibold transition-all',
                    playbackInstrument === inst
                      ? 'bg-studio-accent/20 text-studio-accent'
                      : 'text-studio-muted hover:text-studio-text disabled:opacity-40'
                  )}
                >
                  {inst === 'piano' ? '🎹' : '🎸'}
                </button>
              ))}
            </div>

            {/* Metronome toggle */}
            <button
              onClick={() => setMetronomeEnabled(prev => !prev)}
              className={twMerge(
                'flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-[11px] font-semibold transition-all shrink-0 select-none',
                metronomeEnabled
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'border-studio-border bg-studio-bg text-studio-muted hover:text-studio-text'
              )}
              title={metronomeEnabled ? 'Disable metronome click' : 'Enable metronome click'}
            >
              <span>⏱️</span>
              <span className="hidden sm:inline">Click</span>
              <span className={twMerge(
                'text-[9px] px-1 py-0.2 rounded font-mono uppercase font-bold',
                metronomeEnabled ? 'bg-amber-500/30 text-amber-200' : 'bg-studio-surface text-studio-muted'
              )}>
                {metronomeEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Tempo hint */}
            <span className="text-[11px] text-studio-muted font-mono shrink-0 hidden md:inline">
              {tempo} BPM · {timeSig}
            </span>

            {/* Live Beat Visualizer Dots */}
            {isPlaying && activeBeat !== null && (
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-studio-bg/80 border border-studio-border/60 shrink-0">
                {Array.from({ length: parseInt(timeSig.split('/')[0]) || 4 }).map((_, bIdx) => (
                  <div
                    key={bIdx}
                    className={twMerge(
                      'w-2 h-2 rounded-full transition-all duration-75',
                      activeBeat === bIdx + 1
                        ? bIdx === 0
                          ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                          : 'bg-emerald-400 scale-110 shadow-[0_0_6px_rgba(52,211,153,0.7)]'
                        : 'bg-studio-border/60'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Now Playing indicator */}
            <AnimatePresence>
              {isPlaying && playingSectionId !== null && (() => {
                const sec = sections.find(s => s.id === playingSectionId)
                const chords = sec ? getSoundingChords(sec.chords) : []
                const chord = playingChordIdx !== null ? chords[playingChordIdx] : null
                return sec ? (
                  <motion.div
                    key="now-playing"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center gap-2 ml-auto overflow-hidden min-w-0"
                  >
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                    />
                    <span className="text-[11px] text-studio-muted truncate">
                      {sec.name}
                    </span>
                    {chord && (
                      <span className="text-xs font-bold font-mono text-emerald-300 shrink-0">
                        {chord}
                      </span>
                    )}
                  </motion.div>
                ) : null
              })()}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2.5 pt-2">
        <button
          onClick={newSong}
          className="flex items-center justify-center gap-2 h-10 px-3.5 rounded-lg border border-studio-accent/40 bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20 text-xs font-semibold transition-all shrink-0"
          title="Start a new blank song"
        >
          <FilePlus2 size={14} /> New
        </button>

        <label className="flex-1 min-w-[110px] flex items-center justify-center gap-2 h-10 px-3 rounded-lg border border-studio-border bg-studio-surface hover:bg-studio-surface-2 text-studio-muted hover:text-studio-text text-xs font-semibold transition-colors cursor-pointer select-none">
          <Upload size={14} /> Load JSON
          <input type="file" accept=".json" className="hidden" onChange={loadSong} />
        </label>

        <button
          onClick={saveToLocalStorage}
          className={twMerge(
            'flex-1 min-w-[130px] flex items-center justify-center gap-2 h-10 px-3 rounded-lg border transition-all text-xs font-semibold select-none',
            saveSuccess
              ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
              : 'border-studio-border bg-studio-surface hover:bg-studio-surface-2 text-studio-muted hover:text-studio-text'
          )}
          title="Save song to local storage library"
        >
          {saveSuccess ? (
            <><Check size={14} className="text-emerald-400" /> Saved to Library!</>
          ) : (
            <><Save size={14} /> Save to Library</>
          )}
        </button>

        <button
          onClick={exportCurrentSongJson}
          className="flex-1 min-w-[115px] flex items-center justify-center gap-2 h-10 px-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold transition-all select-none"
          title="Export current song as a JSON file backup"
        >
          <Download size={14} /> Export JSON
        </button>

        <button
          onClick={() => {
            exportSongToMidi(title, displayKey, tempo, sections.map(s => ({
              ...s,
              chords: getSoundingChords(s.chords).join('  ')
            })))
          }}
          className="flex-1 min-w-[115px] flex items-center justify-center gap-2 h-10 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-600/20 select-none"
          title="Export song as standard MIDI file"
        >
          <Zap size={14} /> Export MIDI
        </button>
      </div>
    </motion.div>
  )
}
