import { useState, useMemo, useEffect } from 'react'
import * as Tonal from 'tonal'
import { twMerge } from 'tailwind-merge'
import { playPianoChord, chordNotesToNoteNames } from '@/lib/audio/synth'

// Circle of Fifths clockwise order — C at 12 o'clock
const CIRCLE = [
  { key: 'C',  display: 'C',      minor: 'Am',  minorDisplay: 'Am'  },
  { key: 'G',  display: 'G',      minor: 'Em',  minorDisplay: 'Em'  },
  { key: 'D',  display: 'D',      minor: 'Bm',  minorDisplay: 'Bm'  },
  { key: 'A',  display: 'A',      minor: 'F#m', minorDisplay: 'F♯m' },
  { key: 'E',  display: 'E',      minor: 'C#m', minorDisplay: 'C♯m' },
  { key: 'B',  display: 'B',      minor: 'G#m', minorDisplay: 'G♯m' },
  { key: 'F#', display: 'F♯',     minor: 'D#m', minorDisplay: 'D♯m' },
  { key: 'Db', display: 'D♭',     minor: 'Bbm', minorDisplay: 'B♭m' },
  { key: 'Ab', display: 'A♭',     minor: 'Fm',  minorDisplay: 'Fm'  },
  { key: 'Eb', display: 'E♭',     minor: 'Cm',  minorDisplay: 'Cm'  },
  { key: 'Bb', display: 'B♭',     minor: 'Gm',  minorDisplay: 'Gm'  },
  { key: 'F',  display: 'F',      minor: 'Dm',  minorDisplay: 'Dm'  },
]

const ROMAN_NUMERALS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']

const DEGREE_STYLE = [
  'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'bg-violet-500/15 text-violet-300 border-violet-500/25',
  'bg-violet-500/10 text-violet-300/70 border-violet-500/15',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-red-950/40 text-red-400/70 border-red-500/20',
]

// ── SVG helpers ───────────────────────────────────────────────

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function annularSegment(
  cx: number, cy: number,
  r1: number, r2: number,
  startDeg: number, endDeg: number,
  gapDeg = 1.2,
) {
  const s = startDeg + gapDeg
  const e = endDeg - gapDeg
  const o1 = polarToXY(cx, cy, r2, s)
  const o2 = polarToXY(cx, cy, r2, e)
  const i2 = polarToXY(cx, cy, r1, e)
  const i1 = polarToXY(cx, cy, r1, s)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${r2} ${r2} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${r1} ${r1} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

// ── Colour logic ──────────────────────────────────────────────

function getMajorFill(idx: number, sel: number): string {
  const diff = ((idx - sel) + 12) % 12
  if (diff === 0)  return '#0369a1'  // tonic — sky-700
  if (diff === 1)  return '#9a3412'  // dominant — orange-800
  if (diff === 11) return '#5b21b6'  // subdominant — violet-800
  if (diff === 2 || diff === 10) return '#1e3a5f'
  return '#1a2d42'
}

function getMajorStroke(idx: number, sel: number): string {
  const diff = ((idx - sel) + 12) % 12
  if (diff === 0)  return '#38bdf8'
  if (diff === 1)  return '#fb923c'
  if (diff === 11) return '#a78bfa'
  if (diff === 2 || diff === 10) return '#2563eb'
  return '#1e3a5f'
}

function getMinorFill(idx: number, sel: number): string {
  return idx === sel ? '#064e3b' : '#152032'
}

function getMinorStroke(idx: number, sel: number): string {
  return idx === sel ? '#34d399' : '#1e2d3f'
}

// Enharmonic equivalents — map sharp spellings to the flat spellings used in CIRCLE
const ENHARMONIC: Record<string, string> = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'F#', 'G#': 'Ab', 'A#': 'Bb',
}

function keyToCircleIndex(key: string): number {
  const normalised = ENHARMONIC[key] ?? key
  const idx = CIRCLE.findIndex(c => c.key === normalised)
  return idx === -1 ? 0 : idx
}

interface CircleOfFifthsProps {
  selectedKey?: string
  onKeyChange?: (key: string) => void
}

// ── Component ─────────────────────────────────────────────────

export default function CircleOfFifths({ selectedKey, onKeyChange }: CircleOfFifthsProps) {
  const [selected, setSelected] = useState(() => keyToCircleIndex(selectedKey ?? 'C'))

  // Sync when the parent changes the key
  useEffect(() => {
    if (selectedKey !== undefined) {
      setSelected(keyToCircleIndex(selectedKey))
    }
  }, [selectedKey])

  function handleSelect(i: number) {
    setSelected(i)
    onKeyChange?.(CIRCLE[i].key)
  }

  const cx = 180
  const cy = 180
  const R_MAJ_IN  = 118
  const R_MAJ_OUT = 172
  const R_MIN_IN  = 70
  const R_MIN_OUT = 110
  const R_LABEL_MAJ = 145
  const R_LABEL_MIN = 90

  const entry    = CIRCLE[selected]
  const dominant    = CIRCLE[(selected + 1)  % 12]
  const subdominant = CIRCLE[(selected + 11) % 12]
  const neighbor2   = CIRCLE[(selected + 2)  % 12]

  const diatonicChords = useMemo(() => {
    const majorKey = Tonal.Key.majorKey(entry.key)
    // chords is array of 7 chord names like 'Cmaj7', 'Dm7', ...
    return majorKey.chords.slice(0, 7).map(chordName => {
      const chord = Tonal.Chord.get(chordName)
      // Triad display name
      let triadName = chord.tonic ?? chordName
      if (chord.quality === 'Minor')      triadName += 'm'
      if (chord.quality === 'Diminished') triadName += 'dim'
      return { chordName, triadName, notes: chord.notes }
    })
  }, [entry.key])

  function playDiatonicChord(notes: string[]) {
    const octaved = chordNotesToNoteNames(notes, 'piano')
    playPianoChord(octaved).catch(() => {})
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-studio-text">Circle of Fifths</h3>
        <p className="text-xs text-studio-muted mt-0.5">
          Click a key to explore diatonic chords, harmonic relationships, and modulation targets
        </p>
      </div>

      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── SVG Wheel ────────────────────────────── */}
          <div className="mx-auto lg:mx-0 shrink-0">
            <svg
              width={360}
              height={360}
              viewBox="0 0 360 360"
              className="drop-shadow-xl"
              aria-label="Circle of fifths"
            >
              <defs>
                <radialGradient id="cof-center-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f1e33" />
                  <stop offset="100%" stopColor="#0b1520" />
                </radialGradient>
              </defs>

              {/* Centre disc */}
              <circle cx={cx} cy={cy} r={63} fill="url(#cof-center-grad)" stroke="#1e3a5f" strokeWidth="1.5" />
              <text x={cx} y={cy - 12} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="system-ui" fontWeight="600" letterSpacing="2.5">KEY</text>
              <text x={cx} y={cy + 10} textAnchor="middle" fill="#e2e8f0" fontSize="22" fontFamily="system-ui" fontWeight="700">
                {entry.display}
              </text>
              <text x={cx} y={cy + 28} textAnchor="middle" fill="#34d399" fontSize="11" fontFamily="system-ui">
                {entry.minorDisplay}
              </text>

              {/* Segments */}
              {CIRCLE.map((item, i) => {
                const startDeg = i * 30
                const endDeg   = startDeg + 30
                const midDeg   = startDeg + 15

                const majPath = annularSegment(cx, cy, R_MAJ_IN, R_MAJ_OUT, startDeg, endDeg)
                const minPath = annularSegment(cx, cy, R_MIN_IN, R_MIN_OUT, startDeg, endDeg)

                const majFill   = getMajorFill(i, selected)
                const majStroke = getMajorStroke(i, selected)
                const minFill   = getMinorFill(i, selected)
                const minStroke = getMinorStroke(i, selected)

                const lMaj = polarToXY(cx, cy, R_LABEL_MAJ, midDeg)
                const lMin = polarToXY(cx, cy, R_LABEL_MIN, midDeg)

                const isSelected = i === selected

                return (
                  <g key={item.key}>
                    <path
                      d={majPath}
                      fill={majFill}
                      stroke={majStroke}
                      strokeWidth={isSelected ? 1.5 : 0.75}
                      className="cursor-pointer"
                      onClick={() => handleSelect(i)}
                    />
                    <path
                      d={minPath}
                      fill={minFill}
                      stroke={minStroke}
                      strokeWidth={isSelected ? 1.5 : 0.5}
                      className="cursor-pointer"
                      onClick={() => handleSelect(i)}
                    />
                    <text
                      x={lMaj.x}
                      y={lMaj.y + 4.5}
                      textAnchor="middle"
                      fill={isSelected ? '#f0f9ff' : '#94a3b8'}
                      fontSize={isSelected ? '13' : '11'}
                      fontWeight={isSelected ? '700' : '500'}
                      fontFamily="system-ui"
                      className="pointer-events-none select-none"
                    >
                      {item.display}
                    </text>
                    <text
                      x={lMin.x}
                      y={lMin.y + 3.5}
                      textAnchor="middle"
                      fill={isSelected ? '#6ee7b7' : '#475569'}
                      fontSize="9"
                      fontFamily="system-ui"
                      className="pointer-events-none select-none"
                    >
                      {item.minorDisplay}
                    </text>
                  </g>
                )
              })}

              {/* Subtle ring labels */}
              <text x={cx} y={10} textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="system-ui" letterSpacing="3">MAJOR KEYS</text>
              <text x={cx} y={353} textAnchor="middle" fill="#334155" fontSize="7.5" fontFamily="system-ui" letterSpacing="2">RELATIVE MINOR</text>
            </svg>
          </div>

          {/* ── Info panel ───────────────────────────── */}
          <div className="flex-1 space-y-5 min-w-0">

            {/* Relationships */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Key Relationships</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-sky-400/70 mb-1">Tonic</p>
                  <p className="text-base font-bold text-sky-300">{entry.display} major</p>
                  <p className="text-[11px] text-sky-400/60 mt-0.5">{entry.minorDisplay} relative minor</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-amber-400/70 mb-1">Dominant (V)</p>
                  <p className="text-base font-bold text-amber-300">{dominant.display} major</p>
                  <p className="text-[11px] text-amber-400/60 mt-0.5">{dominant.minorDisplay} relative minor</p>
                </div>
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-violet-400/70 mb-1">Subdominant (IV)</p>
                  <p className="text-base font-bold text-violet-300">{subdominant.display} major</p>
                  <p className="text-[11px] text-violet-400/60 mt-0.5">{subdominant.minorDisplay} relative minor</p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-400/70 mb-1">Relative Minor</p>
                  <p className="text-base font-bold text-emerald-300">{entry.minorDisplay}</p>
                  <p className="text-[11px] text-emerald-400/60 mt-0.5">Same key signature</p>
                </div>
              </div>
            </div>

            {/* Diatonic chords */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">
                Diatonic Chords — {entry.display} Major
              </p>
              <div className="grid grid-cols-7 gap-1">
                {diatonicChords.map(({ triadName, notes }, i) => (
                  <button
                    key={i}
                    onClick={() => playDiatonicChord(notes)}
                    className={twMerge(
                      'flex flex-col items-center gap-1 py-3 px-1 rounded-xl border text-center transition-all hover:scale-105 active:scale-95',
                      DEGREE_STYLE[i],
                    )}
                    title={`Play ${triadName}`}
                  >
                    <span className="text-[9px] font-medium opacity-60 leading-none">{ROMAN_NUMERALS[i]}</span>
                    <span className="text-xs font-bold leading-tight">{triadName}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-studio-muted">Click any chord pill to preview it on piano</p>
            </div>

            {/* Modulation targets */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Modulation Targets</p>
              <div className="space-y-1.5">
                {([
                  { label: 'Dominant — 1 step clockwise',    key: dominant,    color: 'text-amber-300',  tip: 'Bright, energetic lift' },
                  { label: 'Subdominant — 1 step counter',   key: subdominant, color: 'text-violet-300', tip: 'Darker, warmer feel' },
                  { label: '2nd dominant — 2 steps clockwise', key: neighbor2, color: 'text-blue-300',   tip: 'More adventurous shift' },
                ] as const).map(({ label, key: k, color, tip }) => (
                  <button
                    key={k.key}
                    onClick={() => handleSelect(CIRCLE.indexOf(k))}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-studio-border hover:bg-white/[0.04] transition-all text-left group"
                  >
                    <div>
                      <span className={twMerge('text-xs font-semibold', color)}>{k.display} major</span>
                      <span className="text-[11px] text-studio-muted ml-2">· {label}</span>
                    </div>
                    <span className="text-[10px] text-studio-muted group-hover:text-studio-text transition-colors">
                      {tip} →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-1 border-t border-studio-border/50">
              {[
                { color: 'bg-sky-500/60',    label: 'Tonic' },
                { color: 'bg-amber-500/60',  label: 'Dominant' },
                { color: 'bg-violet-500/60', label: 'Subdominant' },
                { color: 'bg-blue-700/60',   label: '2nd neighbours' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={twMerge('w-2.5 h-2.5 rounded-sm', color)} />
                  <span className="text-[10px] text-studio-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
