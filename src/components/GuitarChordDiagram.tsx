interface GuitarChordDiagramProps {
  chordName: string
  frets: number[]
  baseFret?: number
  barres?: { fromString: number; toString: number; fret: number }[]
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CONFIG = {
  sm: { w: 100, h: 130, pad: 10, headerH: 16, labelH: 20, dotR: 4, nutH: 4, fontSize: 7, baseFretFontSize: 7, labelFontSize: 10 },
  md: { w: 140, h: 175, pad: 14, headerH: 20, labelH: 26, dotR: 6, nutH: 5, fontSize: 9, baseFretFontSize: 9, labelFontSize: 14 },
  lg: { w: 180, h: 220, pad: 18, headerH: 24, labelH: 32, dotR: 8, nutH: 6, fontSize: 11, baseFretFontSize: 11, labelFontSize: 18 },
}

export default function GuitarChordDiagram({ chordName, frets, baseFret = 1, barres = [], size = 'md' }: GuitarChordDiagramProps) {
  const cfg = SIZE_CONFIG[size]
  const { w, h, pad, headerH, labelH, dotR, nutH, fontSize } = cfg

  const drawW = w - 2 * pad
  const stringSpacing = drawW / 5  // 5 gaps for 6 strings
  const gridH = h - headerH - labelH - pad
  const fretH = gridH / 5  // 5 frets displayed

  const gridTop = headerH + (baseFret === 1 ? nutH : 0)

  // string 1-6 → x position
  const stringX = (s: number) => pad + (s - 1) * stringSpacing
  // fret 1-5 (relative) → center y position
  const fretY = (f: number) => gridTop + (f - 0.5) * fretH

  return (
    <svg width={w} height={h} xmlns="http://www.w3.org/2000/svg">
      {/* Nut or baseFret indicator */}
      {baseFret === 1 ? (
        <rect x={pad} y={headerH} width={drawW} height={nutH} fill="#e2e8f0" rx={1} />
      ) : (
        <text
          x={pad - 4}
          y={gridTop + fretH * 0.6}
          textAnchor="end"
          fontSize={cfg.baseFretFontSize}
          fill="#64748b"
          fontFamily="monospace"
        >
          {baseFret}
        </text>
      )}

      {/* Fret lines */}
      {[0, 1, 2, 3, 4, 5].map(f => (
        <line
          key={f}
          x1={pad} y1={gridTop + f * fretH}
          x2={pad + drawW} y2={gridTop + f * fretH}
          stroke="#334155" strokeWidth={1}
        />
      ))}

      {/* String lines */}
      {[1,2,3,4,5,6].map(s => (
        <line
          key={s}
          x1={stringX(s)} y1={gridTop}
          x2={stringX(s)} y2={gridTop + 5 * fretH}
          stroke="#475569" strokeWidth={s === 1 ? 2.5 : s === 2 ? 2 : 1.5}
        />
      ))}

      {/* Barres */}
      {barres.map((b, i) => (
        <rect
          key={i}
          x={stringX(b.fromString) - dotR * 0.5}
          y={fretY(b.fret) - fretH * 0.25}
          width={stringX(b.toString) - stringX(b.fromString) + dotR}
          height={fretH * 0.5}
          rx={dotR}
          fill="#38bdf8"
          opacity={0.9}
        />
      ))}

      {/* Muted / open string markers */}
      {frets.map((fret, i) => {
        const s = i + 1
        const sx = stringX(s)
        const sy = headerH * 0.55
        const d = fontSize * 0.5
        if (fret === -1) {
          return (
            <g key={i}>
              <line x1={sx-d} y1={sy-d} x2={sx+d} y2={sy+d} stroke="#ef4444" strokeWidth={1.5} />
              <line x1={sx+d} y1={sy-d} x2={sx-d} y2={sy+d} stroke="#ef4444" strokeWidth={1.5} />
            </g>
          )
        } else if (fret === 0) {
          return <circle key={i} cx={sx} cy={sy} r={fontSize * 0.5} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        }
        return null
      })}

      {/* Finger dots */}
      {frets.map((fret, i) => {
        if (fret <= 0) return null
        const s = i + 1
        const sx = stringX(s)
        const sy = fretY(fret)
        const coveredByBarre = barres.some(b => b.fret === fret && b.fromString <= s && b.toString >= s)
        if (coveredByBarre) return null
        return <circle key={i} cx={sx} cy={sy} r={dotR} fill="#38bdf8" />
      })}

      {/* Chord name label */}
      <text
        x={w / 2}
        y={h - labelH * 0.2}
        textAnchor="middle"
        fontSize={cfg.labelFontSize}
        fill="#e2e8f0"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {chordName}
      </text>
    </svg>
  )
}
