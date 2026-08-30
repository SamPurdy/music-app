import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import * as Tonal from 'tonal'
import GuitarChordDiagram from './GuitarChordDiagram'
import { getGuitarVoicings, ChordVoicing } from '@/lib/guitar/chords'
import { getChordNotes, FLAT_TO_SHARP } from '@/lib/music-theory/notes'
import { playPianoChord, playGuitarChord, chordNotesToNoteNames } from '@/lib/audio/synth'

interface ChordTooltipProps {
  chord: string
  instrument: 'guitar' | 'piano'
  onInstrumentChange: (inst: 'guitar' | 'piano') => void
  children: React.ReactNode
  className?: string
}

// ── Mini Piano Component ──────────────────────────────────────
const WHITE_KEYS_COUNT = 14 // 2 octaves C4 to B5
const WHITE_KEY_WIDTH = 13
const WHITE_KEY_HEIGHT = 54
const BLACK_KEY_WIDTH = 8.5
const BLACK_KEY_HEIGHT = 34

// Semitone chroma offsets for white keys across 2 octaves
const WHITE_KEY_SEMITONES = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23]

// Black keys: [chroma, semitone, whiteKeyIndexBeforeIt]
const BLACK_KEYS_DEF = [
  // Octave 1
  { chroma: 1,  semi: 1,  whiteIdx: 0 }, // C#
  { chroma: 3,  semi: 3,  whiteIdx: 1 }, // D#
  { chroma: 6,  semi: 6,  whiteIdx: 3 }, // F#
  { chroma: 8,  semi: 8,  whiteIdx: 4 }, // G#
  { chroma: 10, semi: 10, whiteIdx: 5 }, // A#
  // Octave 2
  { chroma: 1,  semi: 13, whiteIdx: 7 },  // C#
  { chroma: 3,  semi: 15, whiteIdx: 8 },  // D#
  { chroma: 6,  semi: 18, whiteIdx: 10 }, // F#
  { chroma: 8,  semi: 20, whiteIdx: 11 }, // G#
  { chroma: 10, semi: 22, whiteIdx: 12 }, // A#
]

interface MiniPianoProps {
  chordName: string
  inversionIndex: number
  onInversionCount?: (count: number) => void
}

function MiniPiano({ chordName, inversionIndex }: MiniPianoProps) {
  const { notes, rootNote, activeSemitones, noteLabels } = useMemo(() => {
    const rawNotes = getChordNotes(chordName)
    if (!rawNotes || rawNotes.length === 0) {
      return { notes: [], rootNote: '', activeSemitones: new Set<number>(), noteLabels: new Map<number, string>() }
    }

    const cleanNotes = rawNotes.map(n => FLAT_TO_SHARP[n] ?? n)
    const root = cleanNotes[0]

    const numNotes = cleanNotes.length
    const inv = inversionIndex % numNotes
    // Order notes based on inversion
    const ordered = [...cleanNotes.slice(inv), ...cleanNotes.slice(0, inv)]

    // Map ordered notes to ascending semitones (0..23) starting in octave 1
    const semitones: number[] = []
    const labels = new Map<number, string>()

    let prevSemi = -1
    for (let i = 0; i < ordered.length; i++) {
      const noteName = ordered[i]
      const chroma = Tonal.Note.chroma(noteName) ?? 0
      let semi = chroma
      while (semi <= prevSemi) {
        semi += 12
      }
      semitones.push(semi)
      labels.set(semi, noteName)
      prevSemi = semi
    }

    // If highest note overflows 23, shift all down by 12 if lowest >= 12
    if (semitones[semitones.length - 1] >= 24 && semitones[0] >= 12) {
      const shifted = semitones.map(s => s - 12)
      const shiftedLabels = new Map<number, string>()
      shifted.forEach((s, idx) => shiftedLabels.set(s, ordered[idx]))
      return {
        notes: ordered,
        rootNote: root,
        activeSemitones: new Set(shifted),
        noteLabels: shiftedLabels
      }
    }

    return {
      notes: ordered,
      rootNote: root,
      activeSemitones: new Set(semitones),
      noteLabels: labels
    }
  }, [chordName, inversionIndex])

  const totalWidth = WHITE_KEYS_COUNT * WHITE_KEY_WIDTH

  return (
    <div className="flex flex-col items-center">
      <svg
        width={totalWidth}
        height={WHITE_KEY_HEIGHT}
        className="rounded border border-slate-700 bg-slate-950 select-none shadow-inner"
      >
        {/* White keys */}
        {WHITE_KEY_SEMITONES.map((semi, i) => {
          const x = i * WHITE_KEY_WIDTH
          const isActive = activeSemitones.has(semi)
          const isRoot = isActive && (semi % 12 === (Tonal.Note.chroma(rootNote) ?? 0))
          const label = noteLabels.get(semi)

          return (
            <g key={`w-${semi}`}>
              <rect
                x={x}
                y={0}
                width={WHITE_KEY_WIDTH}
                height={WHITE_KEY_HEIGHT}
                fill={isRoot ? '#10b981' : isActive ? '#38bdf8' : '#f8fafc'}
                stroke="#334155"
                strokeWidth={0.75}
                rx={1}
                className="transition-colors duration-150"
              />
              {isActive && (
                <text
                  x={x + WHITE_KEY_WIDTH / 2}
                  y={WHITE_KEY_HEIGHT - 4}
                  textAnchor="middle"
                  fontSize={7}
                  fontWeight="bold"
                  fill="#0f172a"
                  fontFamily="monospace"
                >
                  {label}
                </text>
              )}
            </g>
          )
        })}

        {/* Black keys */}
        {BLACK_KEYS_DEF.map(({ semi, whiteIdx }) => {
          const x = (whiteIdx + 1) * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2
          const isActive = activeSemitones.has(semi)
          const isRoot = isActive && (semi % 12 === (Tonal.Note.chroma(rootNote) ?? 0))
          const label = noteLabels.get(semi)

          return (
            <g key={`b-${semi}`}>
              <rect
                x={x}
                y={0}
                width={BLACK_KEY_WIDTH}
                height={BLACK_KEY_HEIGHT}
                fill={isRoot ? '#059669' : isActive ? '#0284c7' : '#1e293b'}
                stroke="#0f172a"
                strokeWidth={0.75}
                rx={1}
                className="transition-colors duration-150"
              />
              {isActive && (
                <text
                  x={x + BLACK_KEY_WIDTH / 2}
                  y={BLACK_KEY_HEIGHT - 3}
                  textAnchor="middle"
                  fontSize={6}
                  fontWeight="bold"
                  fill="#ffffff"
                  fontFamily="monospace"
                >
                  {label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      {notes.length > 0 && (
        <div className="flex items-center gap-1 mt-1.5 text-[10px] font-mono text-studio-muted">
          {notes.map((n, i) => (
            <span
              key={i}
              className={twMerge(
                'px-1 py-0.2 rounded text-[9px] font-bold',
                n === rootNote ? 'text-emerald-400 bg-emerald-500/10' : 'text-sky-300 bg-sky-500/10'
              )}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main ChordTooltip Component ───────────────────────────────
export default function ChordTooltip({
  chord,
  instrument,
  onInstrumentChange,
  children,
  className
}: ChordTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [guitarVoicingIdx, setGuitarVoicingIdx] = useState(0)
  const [pianoInversionIdx, setPianoInversionIdx] = useState(0)
  const [coords, setCoords] = useState<{ top: number; left: number; placeBelow: boolean }>({
    top: 0,
    left: 0,
    placeBelow: false,
  })

  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Guitar voicings for current chord
  const guitarVoicings = useMemo(() => {
    return getGuitarVoicings(chord)
  }, [chord])

  // Piano notes / inversion count
  const chordNotes = useMemo(() => {
    return getChordNotes(chord)
  }, [chord])

  const pianoInversionCount = chordNotes.length > 0 ? chordNotes.length : 1

  // Reset indices on chord change
  useEffect(() => {
    setGuitarVoicingIdx(0)
    setPianoInversionIdx(0)
  }, [chord])

  // Compute coordinates on open
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const tooltipW = 210
    const tooltipH = instrument === 'guitar' ? 220 : 155

    // Check vertical placement: default above pill, or below if near top
    const placeBelow = rect.top < tooltipH + 16
    const top = placeBelow ? rect.bottom + 8 : rect.top - tooltipH - 8

    // Center horizontally with viewport bounds
    let left = rect.left + rect.width / 2 - tooltipW / 2
    left = Math.max(12, Math.min(window.innerWidth - tooltipW - 12, left))

    setCoords({ top, left, placeBelow })
  }, [instrument])

  const handleMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    updatePosition()
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  const handleTooltipMouseEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  const handleTooltipMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  // Play audio preview
  const handlePlayChord = (e: React.MouseEvent) => {
    e.stopPropagation()
    const notes = getChordNotes(chord)
    if (notes.length === 0) return

    if (instrument === 'piano') {
      const inv = pianoInversionIdx % notes.length
      const ordered = [...notes.slice(inv), ...notes.slice(0, inv)]
      const noteNames = chordNotesToNoteNames(ordered, 'piano')
      playPianoChord(noteNames).catch(() => {})
    } else {
      const noteNames = chordNotesToNoteNames(notes, 'guitar')
      playGuitarChord(noteNames).catch(() => {})
    }
  }

  // Prev / Next variation handlers
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (instrument === 'guitar') {
      if (guitarVoicings.length <= 1) return
      setGuitarVoicingIdx(prev => (prev - 1 + guitarVoicings.length) % guitarVoicings.length)
    } else {
      setPianoInversionIdx(prev => (prev - 1 + pianoInversionCount) % pianoInversionCount)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (instrument === 'guitar') {
      if (guitarVoicings.length <= 1) return
      setGuitarVoicingIdx(prev => (prev + 1) % guitarVoicings.length)
    } else {
      setPianoInversionIdx(prev => (prev + 1) % pianoInversionCount)
    }
  }

  // Current active guitar voicing
  const activeGuitarVoicing: ChordVoicing | undefined = guitarVoicings[guitarVoicingIdx]

  // Inversion label
  const inversionLabel = useMemo(() => {
    const inv = pianoInversionIdx % pianoInversionCount
    if (inv === 0) return 'Root Position'
    if (inv === 1) return '1st Inversion'
    if (inv === 2) return '2nd Inversion'
    if (inv === 3) return '3rd Inversion'
    return `Inversion ${inv}`
  }, [pianoInversionIdx, pianoInversionCount])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          updatePosition()
          setIsOpen(prev => !prev)
        }}
        className={twMerge('inline-block relative cursor-pointer', className)}
      >
        {children}
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={tooltipRef}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                initial={{ opacity: 0, scale: 0.95, y: coords.placeBelow ? -4 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: coords.placeBelow ? -4 : 4 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'fixed',
                  top: `${coords.top}px`,
                  left: `${coords.left}px`,
                  zIndex: 9999,
                }}
                className="w-[210px] rounded-xl border border-studio-border bg-slate-900/95 backdrop-blur-md p-3 shadow-2xl text-studio-text flex flex-col items-center select-none"
              >
                {/* Header: Chord Name + Instrument Toggle + Audio Play */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-studio-border/50">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-emerald-400">{chord}</span>
                    <button
                      onClick={handlePlayChord}
                      title="Preview chord sound"
                      className="p-1 rounded-md text-studio-muted hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>

                  {/* Instrument switch */}
                  <div className="flex rounded-md border border-studio-border/80 bg-studio-bg/60 p-0.5">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onInstrumentChange('guitar')
                      }}
                      className={twMerge(
                        'px-1.5 py-0.5 rounded text-[10px] font-medium transition-all',
                        instrument === 'guitar'
                          ? 'bg-studio-accent/20 text-studio-accent font-bold shadow-sm'
                          : 'text-studio-muted hover:text-studio-text'
                      )}
                      title="Show Guitar Voicings"
                    >
                      🎸
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onInstrumentChange('piano')
                      }}
                      className={twMerge(
                        'px-1.5 py-0.5 rounded text-[10px] font-medium transition-all',
                        instrument === 'piano'
                          ? 'bg-studio-accent/20 text-studio-accent font-bold shadow-sm'
                          : 'text-studio-muted hover:text-studio-text'
                      )}
                      title="Show Piano Voicings"
                    >
                      🎹
                    </button>
                  </div>
                </div>

                {/* Content: Guitar or Piano View */}
                {instrument === 'guitar' ? (
                  <div className="flex flex-col items-center w-full min-h-[140px] justify-center">
                    {activeGuitarVoicing ? (
                      <GuitarChordDiagram
                        chordName={chord}
                        frets={activeGuitarVoicing.frets}
                        baseFret={activeGuitarVoicing.baseFret ?? 1}
                        barres={activeGuitarVoicing.barres ?? []}
                        size="sm"
                      />
                    ) : (
                      <div className="text-center py-6 px-2 text-xs text-studio-muted/70 italic">
                        No guitar diagram for {chord}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full py-1">
                    <MiniPiano chordName={chord} inversionIndex={pianoInversionIdx} />
                  </div>
                )}

                {/* Footer Variation Controls */}
                <div className="w-full flex items-center justify-between pt-2 mt-2 border-t border-studio-border/40 text-[10px] font-mono text-studio-muted">
                  <button
                    onClick={handlePrev}
                    disabled={instrument === 'guitar' ? guitarVoicings.length <= 1 : pianoInversionCount <= 1}
                    className="p-1 rounded hover:bg-studio-surface hover:text-studio-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Previous variation"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  <span className="truncate px-1 text-center font-medium">
                    {instrument === 'guitar' ? (
                      guitarVoicings.length > 0 ? (
                        <>
                          Shape {guitarVoicingIdx + 1} / {guitarVoicings.length}
                          {activeGuitarVoicing?.baseFret && activeGuitarVoicing.baseFret > 1 && (
                            <span className="text-studio-accent ml-1 font-bold">
                              (Fr {activeGuitarVoicing.baseFret})
                            </span>
                          )}
                        </>
                      ) : (
                        'Standard'
                      )
                    ) : (
                      inversionLabel
                    )}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={instrument === 'guitar' ? guitarVoicings.length <= 1 : pianoInversionCount <= 1}
                    className="p-1 rounded hover:bg-studio-surface hover:text-studio-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Next variation"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
