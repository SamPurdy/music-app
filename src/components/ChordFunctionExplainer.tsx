import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { getChordFunction } from '@/lib/music-theory/chord-functions'

interface Props {
  roman: string
  chordName: string
  keyName: string
  onClose: () => void
}

const COLOR_MAP: Record<string, { bar: string; badge: string; icon: string; border: string }> = {
  sky:    { bar: 'bg-sky-400',    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',    icon: 'text-sky-400',    border: 'border-sky-500/30'    },
  violet: { bar: 'bg-violet-400', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', icon: 'text-violet-400', border: 'border-violet-500/30' },
  amber:  { bar: 'bg-amber-400',  badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',  icon: 'text-amber-400',  border: 'border-amber-500/30'  },
  emerald:{ bar: 'bg-emerald-400',badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: 'text-emerald-400', border: 'border-emerald-500/30'},
  rose:   { bar: 'bg-rose-400',   badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',   icon: 'text-rose-400',   border: 'border-rose-500/30'   },
  purple: { bar: 'bg-purple-400', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: 'text-purple-400', border: 'border-purple-500/30' },
  orange: { bar: 'bg-orange-400', badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30', icon: 'text-orange-400', border: 'border-orange-500/30' },
}

const TENSION_LABELS = ['', 'Very stable', 'Stable', 'Mostly stable', 'Gentle tension', 'Moderate tension', 'Notable tension', 'High tension', 'Very tense', 'Urgent', 'Maximum tension']

export default function ChordFunctionExplainer({ roman, chordName, keyName, onClose }: Props) {
  const info = getChordFunction(roman)
  if (!info) return null

  const colors = COLOR_MAP[info.color] ?? COLOR_MAP.sky
  const tensionPct = (info.tension / 10) * 100
  const tensionLabel = TENSION_LABELS[info.tension] ?? ''

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.22 }}
        className={twMerge(
          'rounded-2xl border bg-studio-surface p-5 space-y-4',
          colors.border
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={twMerge('p-2 rounded-xl bg-studio-surface-2 border', colors.border)}>
              <BookOpen size={14} className={colors.icon} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xl font-bold text-studio-text">{chordName}</span>
                <span className={twMerge('text-[10px] font-bold px-2 py-0.5 rounded-full border', colors.badge)}>
                  {roman} · {info.name}
                </span>
                <span className="text-[10px] text-studio-muted">in {keyName}</span>
              </div>
              <p className="text-[11px] text-studio-muted mt-0.5">{info.shortDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-studio-muted hover:text-studio-text hover:bg-studio-surface-2 transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>

        {/* Tension bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-studio-muted">Harmonic Tension</span>
            <span className="text-[10px] text-studio-muted">{tensionLabel} ({info.tension}/10)</span>
          </div>
          <div className="h-1.5 rounded-full bg-studio-surface-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tensionPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={twMerge('h-full rounded-full', colors.bar)}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-studio-muted leading-relaxed">{info.fullDesc}</p>

        {/* Common cadences + tip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-studio-surface-2 border border-studio-border p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Common Contexts</p>
            <ul className="space-y-1">
              {info.commonCadences.map((cadence) => (
                <li key={cadence} className="flex items-start gap-1.5">
                  <span className={twMerge('mt-1 w-1 h-1 rounded-full shrink-0', colors.bar)} />
                  <span className="text-xs text-studio-text font-mono">{cadence}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={twMerge('rounded-xl border p-3 space-y-2', colors.border, 'bg-studio-surface-2')}>
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">✏ Songwriting Tip</p>
            <p className="text-xs text-studio-text leading-relaxed">{info.songwritingTip}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
