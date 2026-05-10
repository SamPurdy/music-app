import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { GUITAR_CHORDS, OPEN_CHORD_SHAPES, transposeChord } from '@/lib/guitar/chords'
import { SCALES, getScaleNoteIndices } from '@/lib/music-theory/scales'
import GuitarChordDiagram from './GuitarChordDiagram'
import GuitarFretboard from './GuitarFretboard'

type SubTab = 'capo' | 'chords' | 'scales'

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const ROOTS_LABEL = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

const CAPO_FRETS = [0,1,2,3,4,5,6,7]

const CHORD_SUFFIXES = ['', 'm', '7', 'maj7', 'm7']
const CHORD_SUFFIX_LABELS: Record<string, string> = {
  '': 'Major', 'm': 'Minor', '7': 'Dom 7th', 'maj7': 'Maj 7th', 'm7': 'Min 7th'
}

// ── Capo Sub-tab ────────────────────────────────────────────────────────────

function CapoTab() {
  const [capoFret, setCapoFret] = useState(2)
  const [targetKey, setTargetKey] = useState('G')

  // When playing open shapes with capo at fret N, actual sounding key = shape key + N semitones
  // To play in targetKey with capo at capoFret, open shape = targetKey - capoFret semitones
  const shapeRootIdx = (ROOTS.indexOf(targetKey) - capoFret + 12) % 12
  const shapeRoot = ROOTS[shapeRootIdx]

  // Build list of suggested open shapes transposed to the shape root
  const suggestions = OPEN_CHORD_SHAPES.map(openShape => {
    // openShape is an open chord (e.g. 'G', 'Am', 'D')
    // Extract the root of the open shape
    const openShapeRootLen = openShape.length > 1 && (openShape[1] === '#' || openShape[1] === 'b') ? 2 : 1
    const openShapeRoot = openShape.slice(0, openShapeRootLen)
    const openShapeSuffix = openShape.slice(openShapeRootLen)
    // This open shape played with capo at capoFret sounds like openShapeRoot + capoFret semitones
    const soundingIdx = (ROOTS.indexOf(openShapeRoot) + capoFret) % 12
    const soundingRoot = ROOTS[soundingIdx]
    return { shape: openShape, soundingChord: soundingRoot + openShapeSuffix, shapeRoot: openShapeRoot }
  })

  // Selected shape chords that match the target key pattern
  const keyShapes = CHORD_SUFFIXES.map(suffix => {
    const targetChord = shapeRoot + suffix
    const voicing = GUITAR_CHORDS[targetChord]
    if (!voicing) return null
    const soundingIdx = (ROOTS.indexOf(shapeRoot) + capoFret) % 12
    const soundingChord = ROOTS[soundingIdx] + suffix
    return { shape: targetChord, voicing, soundingChord }
  }).filter(Boolean)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Capo Calculator</p>
        <p className="text-xs text-studio-muted">
          Choose your target key and capo position. See which open shapes to play.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Target key */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Target Key</p>
            <div className="relative">
              <select
                value={targetKey}
                onChange={e => setTargetKey(e.target.value)}
                className="w-full h-9 px-3 text-sm font-medium rounded-lg border border-studio-border bg-studio-bg text-studio-text appearance-none focus:outline-none focus:border-sky-500/60"
              >
                {ROOTS.map((r, i) => (
                  <option key={r} value={r}>{ROOTS_LABEL[i]}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg className="w-4 h-4 text-studio-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Capo fret */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Capo Fret</p>
            <div className="flex gap-1 flex-wrap">
              {CAPO_FRETS.map(f => (
                <button
                  key={f}
                  onClick={() => setCapoFret(f)}
                  className={twMerge(
                    'h-8 w-8 rounded-lg text-xs font-mono font-medium transition-all border',
                    capoFret === f
                      ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                      : 'text-studio-muted hover:text-studio-text hover:bg-white/5 border-transparent'
                  )}
                >
                  {f === 0 ? '—' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result summary */}
        <div className="rounded-xl bg-studio-bg/60 border border-studio-border p-3">
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Target Key</p>
              <p className="font-semibold text-studio-accent mt-0.5">{targetKey} Major</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Capo Position</p>
              <p className="font-semibold text-studio-purple mt-0.5">{capoFret === 0 ? 'No capo' : `Fret ${capoFret}`}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Play as</p>
              <p className="font-semibold text-studio-text mt-0.5">{shapeRoot} shapes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chord shapes to play */}
      {keyShapes.length > 0 && (
        <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Chords in {targetKey} Major</p>
            <p className="text-xs text-studio-muted mt-0.5">
              Play these shapes with capo at fret {capoFret}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {keyShapes.map(item => {
              if (!item) return null
              return (
                <div key={item.shape} className="flex flex-col items-center gap-1">
                  <GuitarChordDiagram
                    chordName={item.shape}
                    frets={item.voicing.frets}
                    baseFret={item.voicing.baseFret ?? 1}
                    barres={item.voicing.barres ?? []}
                    size="sm"
                  />
                  <p className="text-[9px] text-studio-muted font-mono">→ {item.soundingChord}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick transposition table */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Transposition Reference</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-studio-muted font-medium pb-2 pr-3">Open Shape</th>
                <th className="text-left text-studio-muted font-medium pb-2 pr-3">Sounds Like</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.slice(0, 8).map(({ shape, soundingChord }) => (
                <tr key={shape} className="border-t border-studio-border/40">
                  <td className="py-1.5 pr-3 font-mono text-studio-accent">{shape}</td>
                  <td className="py-1.5 pr-3 font-mono text-studio-text">{soundingChord}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Chords Sub-tab ──────────────────────────────────────────────────────────

function ChordsTab() {
  const [root, setRoot] = useState('C')
  const [suffix, setSuffix] = useState('')

  const chordName = root + suffix
  const voicing = GUITAR_CHORDS[chordName]

  // Show all suffix variants for current root
  const allVariants = CHORD_SUFFIXES.map(s => ({
    suffix: s,
    label: CHORD_SUFFIX_LABELS[s] ?? s,
    chord: root + s,
    voicing: GUITAR_CHORDS[root + s],
  })).filter(v => v.voicing)

  return (
    <div className="space-y-4">
      {/* Root + quality selectors */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Select Chord</p>

        <div className="space-y-3">
          {/* Root */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-studio-muted">Root</p>
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

          {/* Quality */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-studio-muted">Quality</p>
            <div className="flex flex-wrap gap-1">
              {CHORD_SUFFIXES.map(s => (
                <button
                  key={s || 'maj'}
                  onClick={() => setSuffix(s)}
                  className={twMerge(
                    'h-8 px-3 rounded-lg text-xs font-medium transition-all border',
                    suffix === s
                      ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                      : 'text-studio-muted hover:text-studio-text hover:bg-white/5 border-transparent'
                  )}
                >
                  {CHORD_SUFFIX_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main chord diagram */}
      {voicing ? (
        <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Chord Diagram</p>
              <p className="text-xl font-bold font-mono text-studio-text mt-1">{chordName}</p>
              <p className="text-xs text-studio-muted">{CHORD_SUFFIX_LABELS[suffix]}</p>
            </div>
            <GuitarChordDiagram
              chordName={chordName}
              frets={voicing.frets}
              baseFret={voicing.baseFret ?? 1}
              barres={voicing.barres ?? []}
              size="lg"
            />
          </div>

          {/* Fret positions legend */}
          <div className="rounded-xl bg-studio-bg/60 border border-studio-border p-3">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted mb-2">String Positions</p>
            <div className="flex gap-3">
              {['Low E', 'A', 'D', 'G', 'B', 'High E'].map((str, i) => {
                const fret = voicing.frets[i]
                return (
                  <div key={str} className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] text-studio-muted">{str}</span>
                    <span className={twMerge(
                      'text-xs font-mono font-semibold',
                      fret === -1 ? 'text-red-400' : fret === 0 ? 'text-studio-muted' : 'text-studio-accent'
                    )}>
                      {fret === -1 ? 'X' : fret === 0 ? 'O' : fret}
                    </span>
                  </div>
                )
              })}
            </div>
            {voicing.baseFret && voicing.baseFret > 1 && (
              <p className="text-[10px] text-studio-muted mt-2">Base fret: {voicing.baseFret}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-studio-border bg-studio-surface p-5">
          <p className="text-sm text-studio-muted text-center py-4">No voicing available for {chordName}</p>
        </div>
      )}

      {/* All variants for root */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">{root} Chord Variants</p>
        <div className="flex flex-wrap gap-3">
          {allVariants.map(({ suffix: s, chord, voicing: v }) => (
            <button
              key={chord}
              onClick={() => setSuffix(s)}
              className={twMerge(
                'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all',
                suffix === s
                  ? 'border-sky-500/40 bg-sky-500/5'
                  : 'border-studio-border hover:border-sky-500/20 hover:bg-white/[0.02]'
              )}
            >
              <GuitarChordDiagram
                chordName={chord}
                frets={v.frets}
                baseFret={v.baseFret ?? 1}
                barres={v.barres ?? []}
                size="sm"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Scales Sub-tab ──────────────────────────────────────────────────────────

function ScalesTab() {
  const [root, setRoot] = useState('A')
  const [scaleKey, setScaleKey] = useState('minorPentatonic')
  const [numFrets, setNumFrets] = useState(12)

  const rootIdx = ROOTS.indexOf(root)
  const scaleNotes = getScaleNoteIndices(root, scaleKey)
  const scale = SCALES[scaleKey]

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Fretboard Scale Map</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Root */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-studio-muted">Root</p>
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

          {/* Scale */}
          <div className="space-y-1.5">
            <p className="text-[10px] text-studio-muted">Scale</p>
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

        {/* Fret count */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-studio-muted">Frets to Show</p>
          <div className="flex gap-1">
            {[7, 12, 15].map(n => (
              <button
                key={n}
                onClick={() => setNumFrets(n)}
                className={twMerge(
                  'h-7 px-3 rounded-lg text-xs font-mono transition-all border',
                  numFrets === n
                    ? 'bg-sky-500/15 text-sky-400 border-sky-500/40'
                    : 'text-studio-muted hover:text-studio-text hover:bg-white/5 border-transparent'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Scale info */}
        {scale && (
          <div className="rounded-xl bg-studio-bg/60 border border-studio-border p-3 text-xs space-y-1">
            <p className="font-semibold text-studio-text">{root} {scale.name}</p>
            <p className="text-studio-muted">{scale.description}</p>
            <p className="text-studio-muted"><span className="text-studio-text">Genre:</span> {scale.genre}</p>
            <p className="text-studio-muted"><span className="text-studio-text">Mood:</span> {scale.mood}</p>
          </div>
        )}
      </div>

      {/* Fretboard */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-studio-accent" />
            <span className="text-[10px] text-studio-muted">Root ({root})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-studio-purple" />
            <span className="text-[10px] text-studio-muted">Scale notes</span>
          </div>
        </div>
        <GuitarFretboard
          scaleNotes={scaleNotes}
          rootNote={rootIdx === -1 ? 0 : rootIdx}
          numFrets={numFrets}
        />
      </div>

      {/* Common chord shapes in scale */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Common Chords in {root} {scale?.name}</p>
        <p className="text-xs text-studio-muted">
          Natural chord tones built from the scale root. These voicings work well in this scale context.
        </p>
        <div className="flex flex-wrap gap-3">
          {CHORD_SUFFIXES.slice(0, 3).map(s => {
            const chordName = transposeChord(root + s, 0)
            const v = GUITAR_CHORDS[chordName]
            if (!v) return null
            return (
              <div key={s} className="flex flex-col items-center gap-1">
                <GuitarChordDiagram
                  chordName={chordName}
                  frets={v.frets}
                  baseFret={v.baseFret ?? 1}
                  barres={v.barres ?? []}
                  size="sm"
                />
                <p className="text-[9px] text-studio-muted">{CHORD_SUFFIX_LABELS[s]}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main GuitarLab Component ─────────────────────────────────────────────────

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'capo',   label: 'Capo' },
  { id: 'chords', label: 'Chords' },
  { id: 'scales', label: 'Scales' },
]

export default function GuitarLab() {
  const [subTab, setSubTab] = useState<SubTab>('chords')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-studio-text">Guitar Lab</h2>
        <p className="text-xs text-studio-muted mt-0.5">Chord diagrams, scale maps, and capo tools</p>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-studio-surface border border-studio-border">
        {SUB_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={twMerge(
              'flex-1 h-8 rounded-lg text-xs font-medium transition-all',
              subTab === id
                ? 'bg-sky-500/15 text-sky-400'
                : 'text-studio-muted hover:text-studio-text hover:bg-white/5'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {subTab === 'capo'   && <CapoTab />}
      {subTab === 'chords' && <ChordsTab />}
      {subTab === 'scales' && <ScalesTab />}
    </div>
  )
}
