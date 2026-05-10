interface GuitarFretboardProps {
  scaleNotes: number[]
  rootNote: number
  numFrets?: number
}

// Standard tuning open notes (semitone indices 0-11): E A D G B e
const OPEN_NOTES = [4, 9, 2, 7, 11, 4]
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e']
const FRET_MARKERS = [3, 5, 7, 9, 12]
const NOTE_NAMES_12 = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export default function GuitarFretboard({ scaleNotes, rootNote, numFrets = 12 }: GuitarFretboardProps) {
  const leftMargin = 28
  const topMargin = 22
  const bottomPad = 24
  const stringSpacing = 22
  const fretWidth = 50
  const numStrings = 6

  const totalWidth = leftMargin + numFrets * fretWidth + 10
  const totalHeight = topMargin + (numStrings - 1) * stringSpacing + bottomPad

  const stringY = (s: number) => topMargin + s * stringSpacing
  const fretX = (f: number) => leftMargin + f * fretWidth

  return (
    <div className="overflow-x-auto">
      <svg width={totalWidth} height={totalHeight} xmlns="http://www.w3.org/2000/svg">
        {/* Nut */}
        <rect x={leftMargin - 3} y={topMargin} width={4} height={(numStrings-1)*stringSpacing} fill="#e2e8f0" rx={1} />

        {/* Fret lines */}
        {Array.from({ length: numFrets }, (_, i) => i + 1).map(f => (
          <line
            key={f}
            x1={fretX(f)} y1={topMargin}
            x2={fretX(f)} y2={topMargin + (numStrings-1)*stringSpacing}
            stroke="#334155" strokeWidth={1}
          />
        ))}

        {/* String lines */}
        {Array.from({ length: numStrings }, (_, i) => i).map(s => (
          <line
            key={s}
            x1={leftMargin} y1={stringY(s)}
            x2={fretX(numFrets)} y2={stringY(s)}
            stroke="#475569"
            strokeWidth={s === 0 ? 2.5 : s === 1 ? 2 : s === 2 ? 1.7 : s === 3 ? 1.4 : 1.1}
          />
        ))}

        {/* Fret markers */}
        {FRET_MARKERS.filter(f => f <= numFrets).map(f => {
          const x = fretX(f) - fretWidth / 2
          const y = topMargin + (numStrings - 1) * stringSpacing + 10
          if (f === 12) {
            return (
              <g key={f}>
                <circle cx={x - 5} cy={y} r={3} fill="#475569" />
                <circle cx={x + 5} cy={y} r={3} fill="#475569" />
              </g>
            )
          }
          return <circle key={f} cx={x} cy={y} r={3} fill="#475569" />
        })}

        {/* Fret numbers */}
        {Array.from({ length: numFrets }, (_, i) => i + 1).map(f => (
          <text
            key={f}
            x={fretX(f) - fretWidth / 2}
            y={topMargin - 6}
            textAnchor="middle"
            fontSize={9}
            fill="#64748b"
            fontFamily="monospace"
          >
            {f}
          </text>
        ))}

        {/* String name labels */}
        {Array.from({ length: numStrings }, (_, i) => i).map(s => (
          <text
            key={s}
            x={leftMargin - 8}
            y={stringY(s) + 4}
            textAnchor="end"
            fontSize={9}
            fill="#94a3b8"
            fontFamily="monospace"
          >
            {STRING_NAMES[s]}
          </text>
        ))}

        {/* Scale dots */}
        {Array.from({ length: numStrings }, (_, s) => s).flatMap(s =>
          Array.from({ length: numFrets }, (_, fIdx) => fIdx + 1).map(f => {
            const note = (OPEN_NOTES[s] + f) % 12
            if (!scaleNotes.includes(note)) return null
            const isRoot = note === rootNote
            const cx = fretX(f) - fretWidth / 2
            const cy = stringY(s)
            return (
              <g key={`${s}-${f}`}>
                <circle cx={cx} cy={cy} r={8} fill={isRoot ? '#38bdf8' : '#8b5cf6'} opacity={0.9} />
                <text x={cx} y={cy + 3} textAnchor="middle" fontSize={7} fill="white" fontFamily="monospace" fontWeight="bold">
                  {NOTE_NAMES_12[note]}
                </text>
              </g>
            )
          })
        )}
      </svg>
    </div>
  )
}
