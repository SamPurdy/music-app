export interface ChordVoicing {
  frets: number[]
  fingers?: number[]
  baseFret?: number
  barres?: { fromString: number; toString: number; fret: number }[]
}

const E_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1,3,3,2,1,1], baseFret, barres:[{fromString:1,toString:6,fret:1}]
})
const E_MINOR_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1,3,3,1,1,1], baseFret, barres:[{fromString:1,toString:6,fret:1}]
})
const E_7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1,3,1,2,1,1], baseFret, barres:[{fromString:1,toString:6,fret:1}]
})
const E_MAJ7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1,3,2,2,1,1], baseFret, barres:[{fromString:1,toString:6,fret:1}]
})
const E_M7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1,3,1,1,1,1], baseFret, barres:[{fromString:1,toString:6,fret:1}]
})
const A_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1,1,3,3,3,1], baseFret, barres:[{fromString:2,toString:6,fret:1}]
})
const A_MINOR_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1,1,3,3,2,1], baseFret, barres:[{fromString:2,toString:6,fret:1}]
})
const A_7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1,1,3,1,3,1], baseFret
})
const A_MAJ7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1,1,3,2,3,1], baseFret
})
const A_M7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1,1,3,1,2,1], baseFret, barres:[{fromString:2,toString:6,fret:1}]
})

export const GUITAR_CHORDS: Record<string, ChordVoicing> = {
  // ── C ──────────────────────────────────
  'C':      { frets: [-1,3,2,0,1,0] },
  'Cm':     A_MINOR_BARRE(3),
  'C7':     { frets: [-1,3,2,3,1,0] },
  'Cmaj7':  { frets: [-1,3,2,0,0,0] },
  'Cm7':    A_M7_BARRE(3),
  // ── C# ─────────────────────────────────
  'C#':     A_BARRE(4),
  'C#m':    A_MINOR_BARRE(4),
  'C#7':    A_7_BARRE(4),
  'C#maj7': A_MAJ7_BARRE(4),
  'C#m7':   A_M7_BARRE(4),
  // ── D ──────────────────────────────────
  'D':      { frets: [-1,-1,0,2,3,2] },
  'Dm':     { frets: [-1,-1,0,2,3,1] },
  'D7':     { frets: [-1,-1,0,2,1,2] },
  'Dmaj7':  { frets: [-1,-1,0,2,2,2] },
  'Dm7':    { frets: [-1,-1,0,2,1,1] },
  // ── D# ─────────────────────────────────
  'D#':     A_BARRE(6),
  'D#m':    A_MINOR_BARRE(6),
  'D#7':    A_7_BARRE(6),
  'D#maj7': A_MAJ7_BARRE(6),
  'D#m7':   A_M7_BARRE(6),
  // ── E ──────────────────────────────────
  'E':      { frets: [0,2,2,1,0,0] },
  'Em':     { frets: [0,2,2,0,0,0] },
  'E7':     { frets: [0,2,0,1,0,0] },
  'Emaj7':  { frets: [0,2,1,1,0,0] },
  'Em7':    { frets: [0,2,0,0,0,0] },
  // ── F ──────────────────────────────────
  'F':      E_BARRE(1),
  'Fm':     E_MINOR_BARRE(1),
  'F7':     E_7_BARRE(1),
  'Fmaj7':  { frets: [-1,-1,3,2,1,0] },
  'Fm7':    E_M7_BARRE(1),
  // ── F# ─────────────────────────────────
  'F#':     E_BARRE(2),
  'F#m':    E_MINOR_BARRE(2),
  'F#7':    E_7_BARRE(2),
  'F#maj7': E_MAJ7_BARRE(2),
  'F#m7':   E_M7_BARRE(2),
  // ── G ──────────────────────────────────
  'G':      { frets: [3,2,0,0,0,3] },
  'Gm':     E_MINOR_BARRE(3),
  'G7':     { frets: [3,2,0,0,0,1] },
  'Gmaj7':  { frets: [3,2,0,0,0,2] },
  'Gm7':    E_M7_BARRE(3),
  // ── G# ─────────────────────────────────
  'G#':     E_BARRE(4),
  'G#m':    E_MINOR_BARRE(4),
  'G#7':    E_7_BARRE(4),
  'G#maj7': E_MAJ7_BARRE(4),
  'G#m7':   E_M7_BARRE(4),
  // ── A ──────────────────────────────────
  'A':      { frets: [-1,0,2,2,2,0] },
  'Am':     { frets: [-1,0,2,2,1,0] },
  'A7':     { frets: [-1,0,2,0,2,0] },
  'Amaj7':  { frets: [-1,0,2,1,2,0] },
  'Am7':    { frets: [-1,0,2,0,1,0] },
  // ── A# ─────────────────────────────────
  'A#':     A_BARRE(1),
  'A#m':    A_MINOR_BARRE(1),
  'A#7':    A_7_BARRE(1),
  'A#maj7': A_MAJ7_BARRE(1),
  'A#m7':   A_M7_BARRE(1),
  // ── B ──────────────────────────────────
  'B':      A_BARRE(2),
  'Bm':     A_MINOR_BARRE(2),
  'B7':     { frets: [-1,2,1,2,0,2] },
  'Bmaj7':  A_MAJ7_BARRE(2),
  'Bm7':    A_M7_BARRE(2),
  // ── Extra open shapes for capo transposer ──
  'Cadd9':  { frets: [-1,3,2,0,3,0] },
  'Asus2':  { frets: [-1,0,2,2,0,0] },
  'Dsus2':  { frets: [-1,-1,0,2,3,0] },
  'Esus4':  { frets: [0,2,2,2,0,0] },
}

export const OPEN_CHORD_SHAPES: string[] = [
  'C', 'D', 'E', 'G', 'A', 'Am', 'Em', 'Dm', 'E7', 'A7', 'D7', 'G7', 'Cadd9', 'Asus2', 'Dsus2', 'Esus4'
]

export function transposeChord(chordName: string, semitones: number): string {
  if (semitones === 0) return chordName
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  let rootLen = 1
  if (chordName.length > 1 && (chordName[1] === '#' || chordName[1] === 'b')) {
    rootLen = 2
  }
  const root = chordName.slice(0, rootLen)
  const suffix = chordName.slice(rootLen)
  const flatToSharp: Record<string, string> = { 'Db':'C#','Eb':'D#','Gb':'F#','Ab':'G#','Bb':'A#' }
  const resolvedRoot = flatToSharp[root] ?? root
  const idx = notes.indexOf(resolvedRoot)
  if (idx === -1) return chordName
  return notes[(idx + semitones) % 12] + suffix
}
