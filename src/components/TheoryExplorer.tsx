import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { SCALES, getScaleNoteNames, getScaleNoteIndices } from '@/lib/music-theory/scales'
import { INTERVALS } from '@/lib/music-theory/intervals'
import PianoKeyboard from './PianoKeyboard'

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const ROOTS_LABEL = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

const CONSONANCE_COLOR: Record<string, string> = {
  perfect:   'text-studio-accent',
  consonant: 'text-studio-success',
  dissonant: 'text-amber-400',
}

const CONSONANCE_BG: Record<string, string> = {
  perfect:   'bg-studio-accent/10 border-studio-accent/30',
  consonant: 'bg-studio-success/10 border-studio-success/30',
  dissonant: 'bg-amber-400/10 border-amber-400/30',
}

export default function TheoryExplorer() {
  const [root, setRoot] = useState('C')
  const [scaleKey, setScaleKey] = useState('major')

  const scale = SCALES[scaleKey]
  const noteNames = getScaleNoteNames(root, scaleKey)
  const noteIndices = getScaleNoteIndices(root, scaleKey)
  const rootIdx = ROOTS.indexOf(root)

  // Intervals from root to each note in scale
  const scaleIntervals = scale
    ? [0, ...scale.intervals].map(semitones => INTERVALS.find(iv => iv.semitones === semitones))
    : []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-studio-text">Theory Explorer</h2>
        <p className="text-xs text-studio-muted mt-0.5">Explore scales, intervals, and note relationships</p>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Root selector */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Root Note</p>
            <div className="grid grid-cols-6 gap-1">
              {ROOTS.map((r, i) => (
                <button
                  key={r}
                  onClick={() => setRoot(r)}
                  className={twMerge(
                    'h-8 rounded-lg text-[11px] font-mono font-medium transition-all border',
                    root === r
                      ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                      : 'text-studio-muted hover:text-studio-text hover:bg-white/5 border-transparent'
                  )}
                >
                  {ROOTS_LABEL[i]}
                </button>
              ))}
            </div>
          </div>

          {/* Scale selector */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Scale</p>
            <div className="relative">
              <select
                value={scaleKey}
                onChange={e => setScaleKey(e.target.value)}
                className="w-full h-9 px-3 text-sm font-medium rounded-lg border border-studio-border bg-studio-bg text-studio-text appearance-none focus:outline-none focus:border-sky-500/60"
              >
                {Object.entries(SCALES).map(([key, def]) => (
                  <option key={key} value={key}>{def.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg className="w-4 h-4 text-studio-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scale info */}
        {scale && (
          <div className="rounded-xl bg-studio-bg/60 border border-studio-border p-3 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-studio-text">{root} {scale.name}</p>
                <p className="text-xs text-studio-muted mt-0.5">{scale.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-widest text-studio-muted">Notes</p>
                <p className="text-xs font-mono text-studio-text mt-0.5">{noteNames.join(' · ')}</p>
              </div>
            </div>
            <div className="flex gap-4 pt-1 border-t border-studio-border/50">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-studio-muted">Genre</p>
                <p className="text-xs text-studio-text mt-0.5">{scale.genre}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-studio-muted">Mood</p>
                <p className="text-xs text-studio-text mt-0.5">{scale.mood}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Piano keyboard */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Piano — {root} {scale?.name}</p>
        <PianoKeyboard
          highlightedNotes={noteIndices}
          rootNote={rootIdx === -1 ? undefined : rootIdx}
          label={`${noteNames.length} notes highlighted · root in sky blue`}
        />
        <div className="flex gap-4 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-studio-accent" />
            <span className="text-[10px] text-studio-muted">Root note</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-studio-accent/30 border border-studio-accent/60" />
            <span className="text-[10px] text-studio-muted">Scale notes</span>
          </div>
        </div>
      </div>

      {/* Interval table */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Scale Intervals</p>
        <div className="grid gap-1.5">
          {scaleIntervals.map((interval, idx) => {
            if (!interval) return null
            const noteName = noteNames[idx] ?? ''
            return (
              <div
                key={idx}
                className={twMerge(
                  'flex items-center gap-3 px-3 py-2 rounded-lg border text-xs',
                  CONSONANCE_BG[interval.consonance]
                )}
              >
                <span className="font-mono font-bold text-studio-muted w-5 text-center">{idx === 0 ? '1' : idx}</span>
                <span className={twMerge('font-mono font-semibold w-7', CONSONANCE_COLOR[interval.consonance])}>
                  {interval.shortName}
                </span>
                <span className="font-mono font-semibold text-studio-text w-6">{noteName}</span>
                <span className="text-studio-muted flex-1">{interval.fullName}</span>
                <span className="text-studio-muted text-[10px] hidden sm:block">{interval.description}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Full interval reference */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">All Intervals Reference</p>
        <div className="grid gap-1">
          {INTERVALS.map(interval => (
            <div
              key={interval.semitones}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/[0.02] transition-colors text-xs"
            >
              <span className="font-mono text-studio-muted w-4 text-center">{interval.semitones}</span>
              <span className={twMerge('font-mono font-semibold w-7', CONSONANCE_COLOR[interval.consonance])}>
                {interval.shortName}
              </span>
              <span className="text-studio-text flex-1">{interval.fullName}</span>
              <span className="text-studio-muted hidden sm:block">{interval.example}</span>
              <span className={twMerge(
                'text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded font-medium border',
                CONSONANCE_BG[interval.consonance],
                CONSONANCE_COLOR[interval.consonance]
              )}>
                {interval.consonance}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
