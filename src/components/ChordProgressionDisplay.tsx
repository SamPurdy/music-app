import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Shuffle, Download, Music2, Layers } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { generateMajorProgression, generateMinorProgression } from '@/lib/music-theory/progressions'
import type { ChordQuality } from '@/types'

const KEYS        = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const KEYS_LABEL  = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const LENGTHS     = [2, 4, 6, 8, 12, 16]

type Quality = ChordQuality

const QUALITY_STYLE: Record<Quality, { bg: string; border: string; text: string; roman: string }> = {
  major:      { bg: 'bg-sky-500/10',    border: 'border-sky-500/25',    text: 'text-sky-400',    roman: 'text-sky-400/70'    },
  minor:      { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-400', roman: 'text-violet-400/70' },
  diminished: { bg: 'bg-amber-500/10',  border: 'border-amber-500/25',  text: 'text-amber-400',  roman: 'text-amber-400/70'  },
}

type Progression = ReturnType<typeof generateMajorProgression>

export default function ChordProgressionDisplay() {
  const [key, setKey]           = useState('C')
  const [mode, setMode]         = useState<'major' | 'minor'>('major')
  const [length, setLength]     = useState(4)
  const [result, setResult]     = useState<Progression | null>(null)

  const generate = () => {
    const prog = mode === 'major'
      ? generateMajorProgression(key, length)
      : generateMinorProgression(key, length)
    setResult(prog)
  }

  return (
    <div className="w-full space-y-5">

      {/* ── Controls card ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <Layers size={15} className="text-sky-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-studio-text">Chord Lab</h2>
            <p className="text-[11px] text-studio-muted">Generate and analyse chord progressions</p>
          </div>
        </div>

        {/* Key + Mode + Length + Button row */}
        <div className="flex flex-wrap items-end gap-3">

          {/* Key */}
          <div className="min-w-[110px]">
            <label className="block mb-1.5 text-[10px] uppercase tracking-widest text-studio-muted">Key</label>
            <select
              value={key}
              onChange={e => setKey(e.target.value)}
              className="w-full h-9 px-3 text-sm font-medium rounded-lg border border-studio-border bg-studio-bg text-studio-text appearance-none focus:outline-none focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/10 transition-all"
            >
              {KEYS.map((k, i) => <option key={k} value={k}>{KEYS_LABEL[i]}</option>)}
            </select>
          </div>

          {/* Mode */}
          <div className="min-w-[150px]">
            <label className="block mb-1.5 text-[10px] uppercase tracking-widest text-studio-muted">Mode</label>
            <div className="flex h-9 rounded-lg border border-studio-border bg-studio-bg overflow-hidden">
              {(['major', 'minor'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={twMerge(
                    'flex-1 text-xs font-medium transition-all',
                    mode === m ? 'bg-sky-500/15 text-sky-400' : 'text-studio-muted hover:text-studio-text hover:bg-white/5'
                  )}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1.5 text-[10px] uppercase tracking-widest text-studio-muted">Bars</label>
            <div className="flex h-9 rounded-lg border border-studio-border bg-studio-bg overflow-hidden">
              {LENGTHS.map(n => (
                <button
                  key={n}
                  onClick={() => setLength(n)}
                  className={twMerge(
                    'flex-1 text-xs font-mono font-medium transition-all',
                    length === n ? 'bg-sky-500/15 text-sky-400' : 'text-studio-muted hover:text-studio-text hover:bg-white/5'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Generate */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={generate}
            className="h-9 px-5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-sky-600/20 shrink-0"
          >
            <Play size={12} fill="currentColor" />
            Generate
          </motion.button>
        </div>
      </div>

      {/* ── Chord display ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="chords"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Info row */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                <span className="text-sm font-semibold text-studio-text">
                  {result.key} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </span>
                <span className="text-[11px] text-studio-muted font-mono">
                  {result.scaleNotes.join('  ')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-studio-muted">{result.chords.length} chords</span>
                <button
                  onClick={generate}
                  className="p-1.5 rounded-lg text-studio-muted hover:text-studio-text hover:bg-studio-surface border border-transparent hover:border-studio-border transition-all"
                  title="Regenerate"
                >
                  <Shuffle size={13} />
                </button>
                <button
                  className="p-1.5 rounded-lg text-studio-muted hover:text-studio-text hover:bg-studio-surface border border-transparent hover:border-studio-border transition-all"
                  title="Export MIDI"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {result.chords.map((chord, i) => {
                const q = chord.quality as Quality
                const style = QUALITY_STYLE[q] ?? QUALITY_STYLE.major
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.22 }}
                    className={twMerge(
                      'group relative p-4 rounded-xl border cursor-default transition-all hover:-translate-y-0.5 hover:shadow-lg',
                      style.bg, style.border
                    )}
                  >
                    {/* Position */}
                    <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-studio-muted/40">
                      {i + 1}
                    </div>

                    {/* Roman numeral */}
                    <div className={twMerge('text-[10px] font-bold uppercase tracking-widest mb-1.5', style.roman)}>
                      {chord.roman}
                    </div>

                    {/* Chord name */}
                    <div className="text-2xl font-bold text-studio-text font-mono tracking-tight mb-3">
                      {chord.full}
                    </div>

                    {/* Notes */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {chord.notes.map(note => (
                        <span
                          key={note}
                          className={twMerge(
                            'text-[9px] font-mono px-1.5 py-0.5 rounded-md border',
                            style.bg, style.border, style.text
                          )}
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Quality */}
                    <div className={twMerge('text-[9px] uppercase tracking-widest font-semibold opacity-50', style.text)}>
                      {chord.quality}
                    </div>

                    {/* Hover accent line */}
                    <div className={twMerge(
                      'absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity',
                      q === 'major' ? 'bg-sky-400' : q === 'minor' ? 'bg-violet-400' : 'bg-amber-400'
                    )} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-52 rounded-2xl border border-dashed border-studio-border bg-studio-surface/20"
          >
            <Music2 size={28} className="text-studio-muted/30 mb-3" />
            <p className="text-sm text-studio-muted">Select a key and generate a progression</p>
            <p className="text-[11px] text-studio-muted/50 mt-1">Chords will appear here</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

