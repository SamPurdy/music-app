import * as Tonal from 'tonal'

export interface NoteData {
  name: string
  octave: number
  midi: number
  frequency: number
}

const A4 = 440
const A4_MIDI = 69

export const NOTE_NAMES = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'] as const

export function noteToMidi(note: string, octave: number): number {
  const baseIndex = NOTE_NAMES.findIndex(n => n === note)
  if (baseIndex === -1) return A4_MIDI
  return (octave + 1) * 12 + baseIndex
}

export function midiToNote(midi: number): NoteData {
  const octave = Math.floor(midi / 12) - 1
  const noteIndex = midi % 12
  const name = NOTE_NAMES[noteIndex] ?? 'C'
  const frequency = A4 * Math.pow(2, (midi - A4_MIDI) / 12)
  return {
    name,
    octave,
    midi,
    frequency: Math.round(frequency * 100) / 100,
  }
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
    return chord?.notes.map(n => n.toLowerCase()) ?? []
  } catch {
    return []
  }
}

export function getRomanNumeral(chordName: string, key: string): string {
  try {
    const root = Tonal.Chord.get(chordName)?.root
    if (!root) return '?'
    const scale = Tonal.Scale.get(`${key} major`)
    const degree = scale.notes.findIndex(
      n => Tonal.Note.pitchClass(n) === Tonal.Note.pitchClass(root)
    )
    if (degree === -1) return '?'
    const ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const
    return ROMANS[degree] ?? '?'
  } catch {
    return '?'
  }
}
