import * as Tonal from 'tonal'

export interface NoteData {
  name: string
  octave: number
  midi: number
  frequency: number
}

const A4 = 440
const A4_MIDI = 69

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Fb: 'E', Gb: 'F#', Ab: 'G#', Bb: 'A#', Cb: 'B',
  db: 'C#', eb: 'D#', fb: 'E', gb: 'F#', ab: 'G#', bb: 'A#', cb: 'B'
}

export function noteToMidi(note: string, octave: number): number {
  const midi = Tonal.Note.midi(`${note}${octave}`)
  return midi !== null ? midi : A4_MIDI
}

export function midiToNote(midi: number): NoteData {
  const noteName = Tonal.Note.fromMidi(midi) ?? 'C4'
  const noteObj = Tonal.Note.get(noteName)
  const name = noteObj.pc ?? 'C'
  const octave = noteObj.oct ?? 4
  const frequency = A4 * Math.pow(2, (midi - A4_MIDI) / 12)
  return {
    name,
    octave,
    midi,
    frequency: Math.round(frequency * 100) / 100,
  }
}

export function transposeChordName(chordName: string, semitones: number): string {
  if (!chordName || semitones === 0) return chordName
  const rootMatch = chordName.match(/^([A-G][#b]?)(.*)$/)
  if (!rootMatch) return chordName
  const root = FLAT_TO_SHARP[rootMatch[1]] ?? rootMatch[1]
  const suffix = rootMatch[2]
  const idx = NOTE_NAMES.indexOf(root as any)
  if (idx === -1) return chordName
  const newIdx = ((idx + semitones) % 12 + 12) % 12
  return NOTE_NAMES[newIdx] + suffix
}

export function getScaleNotes(scaleName: string): { notes: string[]; intervals: string[] } {
  try {
    const scale = Tonal.Scale.get(scaleName)
    return {
      notes: scale.notes ?? [],
      intervals: scale.intervals ?? [],
    }
  } catch {
    return { notes: [], intervals: [] }
  }
}

export function getChordNotes(chordName: string): string[] {
  try {
    const chord = Tonal.Chord.get(chordName)
    return chord?.notes ?? []
  } catch {
    return []
  }
}

export function getChordNoteIndices(chordName: string): number[] {
  try {
    const chord = Tonal.Chord.get(chordName)
    if (!chord?.notes?.length) return []
    return chord.notes
      .map(n => Tonal.Note.chroma(n))
      .filter((c): c is number => c !== undefined && c !== null)
  } catch {
    return []
  }
}

export function getRomanNumeral(chordName: string, key: string, scaleType: 'major' | 'minor' = 'major'): string {
  try {
    const root = Tonal.Chord.get(chordName)?.root
    if (!root) return '?'
    const scale = Tonal.Scale.get(`${key} ${scaleType}`)
    const degree = scale.notes.findIndex(
      n => Tonal.Note.pitchClass(n) === Tonal.Note.pitchClass(root)
    )
    if (degree === -1) return '?'
    const romans = scaleType === 'minor'
      ? ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII']
      : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
    return romans[degree] ?? '?'
  } catch {
    return '?'
  }
}
