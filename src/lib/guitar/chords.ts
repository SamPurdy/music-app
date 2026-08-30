import { transposeChordName, NOTE_NAMES, FLAT_TO_SHARP } from '@/lib/music-theory/notes'

export interface ChordVoicing {
  frets: number[]
  fingers?: number[]
  baseFret?: number
  barres?: { fromString: number; toString: number; fret: number }[]
}

// ── CAGED Barre Shape Generators ──────────────────────────────

// E-Shape: root on String 6 at baseFret
const E_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1, 3, 3, 2, 1, 1], baseFret, barres: [{ fromString: 1, toString: 6, fret: 1 }]
})
const E_MINOR_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1, 3, 3, 1, 1, 1], baseFret, barres: [{ fromString: 1, toString: 6, fret: 1 }]
})
const E_7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1, 3, 1, 2, 1, 1], baseFret, barres: [{ fromString: 1, toString: 6, fret: 1 }]
})
const E_MAJ7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1, 3, 2, 2, 1, 1], baseFret, barres: [{ fromString: 1, toString: 6, fret: 1 }]
})
const E_M7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [1, 3, 1, 1, 1, 1], baseFret, barres: [{ fromString: 1, toString: 6, fret: 1 }]
})

// A-Shape: root on String 5 at baseFret
const A_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 1, 3, 3, 3, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})
const A_MINOR_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 1, 3, 3, 2, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})
const A_7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 1, 3, 1, 3, 1], baseFret
})
const A_MAJ7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 1, 3, 2, 3, 1], baseFret
})
const A_M7_BARRE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 1, 3, 1, 2, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})

// D-Shape: root on String 4 at baseFret
const D_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, -1, 1, 3, 4, 3], baseFret
})
const D_MINOR_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, -1, 1, 3, 4, 2], baseFret
})
const D_7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, -1, 1, 3, 2, 3], baseFret
})
const D_MAJ7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, -1, 1, 3, 3, 3], baseFret
})
const D_M7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, -1, 1, 3, 2, 2], baseFret
})

// C-Shape: root on String 5 at (baseFret + 2 or 3)
const C_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 4, 3, 1, 2, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})
const C_MINOR_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 4, 2, 1, 2, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})
const C_7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 4, 3, 4, 2, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})
const C_MAJ7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 4, 3, 1, 1, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})
const C_M7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [-1, 4, 2, 4, 2, 1], baseFret, barres: [{ fromString: 2, toString: 6, fret: 1 }]
})

// G-Shape: root on String 6 at (baseFret + 3)
const G_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [4, 3, 1, 1, 1, 4], baseFret, barres: [{ fromString: 3, toString: 5, fret: 1 }]
})
const G_MINOR_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [4, 2, 1, 1, 4, 4], baseFret, barres: [{ fromString: 3, toString: 4, fret: 1 }]
})
const G_7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [4, 3, 1, 1, 1, 2], baseFret, barres: [{ fromString: 3, toString: 5, fret: 1 }]
})
const G_MAJ7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [4, 3, 1, 1, 1, 3], baseFret, barres: [{ fromString: 3, toString: 5, fret: 1 }]
})
const G_M7_SHAPE = (baseFret: number): ChordVoicing => ({
  frets: [4, 2, 1, 1, 4, 2], baseFret
})

type BarreGen = (fret: number) => ChordVoicing

interface CagedGenerators {
  e: BarreGen
  a: BarreGen
  d: BarreGen
  c: BarreGen
  g: BarreGen
}

const CAGED_GENERATORS: Record<string, CagedGenerators> = {
  '':     { e: E_BARRE,       a: A_BARRE,       d: D_SHAPE,       c: C_SHAPE,       g: G_SHAPE       },
  'm':    { e: E_MINOR_BARRE, a: A_MINOR_BARRE, d: D_MINOR_SHAPE, c: C_MINOR_SHAPE, g: G_MINOR_SHAPE },
  '7':    { e: E_7_BARRE,     a: A_7_BARRE,     d: D_7_SHAPE,     c: C_7_SHAPE,     g: G_7_SHAPE     },
  'maj7': { e: E_MAJ7_BARRE,  a: A_MAJ7_BARRE,  d: D_MAJ7_SHAPE,  c: C_MAJ7_SHAPE,  g: G_MAJ7_SHAPE  },
  'm7':   { e: E_M7_BARRE,    a: A_M7_BARRE,    d: D_M7_SHAPE,    c: C_M7_SHAPE,    g: G_M7_SHAPE    },
}

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
  return transposeChordName(chordName, semitones)
}



/** Return multiple voicings for a chord (primary + computed CAGED alternatives across the fretboard). */
export function getGuitarVoicings(chordName: string): ChordVoicing[] {
  // Parse root & suffix
  const match = chordName.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return []

  const rawRoot = match[1]
  const root = FLAT_TO_SHARP[rawRoot] ?? rawRoot
  const suffix = match[2]
  const normalizedName = root + suffix

  // Primary voicing (lookup with both original and normalized name)
  const primary = GUITAR_CHORDS[normalizedName] ?? GUITAR_CHORDS[chordName]

  const rootIdx = NOTE_NAMES.indexOf(root as any)
  if (rootIdx === -1) return primary ? [primary] : []

  const voicings: ChordVoicing[] = []
  if (primary) voicings.push(primary)

  const gens = CAGED_GENERATORS[suffix]
  if (gens) {
    // 1. E-shape (root on 6th string, open is E = index 4)
    const eFret = (rootIdx - 4 + 12) % 12
    if (eFret > 0) {
      voicings.push(gens.e(eFret))
    } else {
      voicings.push(gens.e(12))
    }

    // 2. A-shape (root on 5th string, open is A = index 9)
    const aFret = (rootIdx - 9 + 12) % 12
    if (aFret > 0) {
      voicings.push(gens.a(aFret))
    } else {
      voicings.push(gens.a(12))
    }

    // 3. D-shape (root on 4th string, open is D = index 2)
    const dFret = (rootIdx - 2 + 12) % 12
    if (dFret > 0) {
      voicings.push(gens.d(dFret))
    } else {
      voicings.push(gens.d(12))
    }

    // 4. C-shape (root on 5th string at baseFret + 3)
    const cFret = ((rootIdx - 9 - 3 + 24) % 12) + 1
    if (cFret >= 1 && cFret <= 12) {
      voicings.push(gens.c(cFret))
    }

    // 5. G-shape (root on 6th string at baseFret + 3)
    const gFret = ((rootIdx - 4 - 3 + 24) % 12) + 1
    if (gFret >= 1 && gFret <= 10) {
      voicings.push(gens.g(gFret))
    }
  }

  // Deduplicate by frets and baseFret
  const unique: ChordVoicing[] = []
  const seen = new Set<string>()
  for (const v of voicings) {
    const key = JSON.stringify({ f: v.frets, b: v.baseFret ?? 1 })
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(v)
    }
  }

  // Sort by baseFret ascending so cycling goes naturally up the fretboard
  unique.sort((a, b) => (a.baseFret ?? 1) - (b.baseFret ?? 1))

  return unique.length > 0 ? unique : []
}
