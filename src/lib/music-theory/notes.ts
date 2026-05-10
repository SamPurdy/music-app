import * as Tonal from 'tonal'

export interface NoteData {
  name: string
  octave: number
  midi: number
  frequency: number
}

const A4 = 440
const A4_MIDI = 69

export function noteToMidi(note: string, octave: number): number {
  const noteNames = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  let baseIndex: number
  
  const noteName = note.replace(/[^A-G]/g, '')
  const accidental = note.replace(/[A-Ga-g]/g, '').trim()
  
  baseIndex = noteNames.findIndex(n => n === noteName)
  if (baseIndex === -1) return 69 + 12 * octave
  
  if (accidental === 'b') {
    baseIndex -= 1
  }
  
  return (octave + 1) * 12 + baseIndex
}

export function midiToNote(midi: number): NoteData {
  const noteNames = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  const octave = Math.floor(midi / 12) - 1
  const noteIndex = midi % 12
  const name = noteNames[noteIndex]
  const frequency = A4 * Math.pow(2, (midi - A4_MIDI) / 12)
  
  return {
    name,
    octave,
    midi,
    frequency: Math.round(frequency * 100) / 100,
  }
}

export function getScaleNotes(scaleName: string): { notes?: string[]; intervals?: string[] } {
  try {
    const scale = Tonal.Scale.get(scaleName)
    if (!scale) return {}
    
    return {
      notes: Array.isArray(scale.notes) ? scale.notes : (scale.notes as any || []),
      intervals: (Array.isArray(scale.intervals) 
        ? scale.intervals.map(v => Number(v)) 
        : (scale.intervals as any || [])),
    }
  } catch {
    return {}
  }
}

export function getChordNotes(chordName: string): string[] {
  try {
    const chord = Tonal.Chord.get(chordName)
    return chord?.notes.map(n => n.toLowerCase()) || []
  } catch {
    return []
  }
}

export function getRomanNumeral(chordName: string, key: string): string {
  try {
    const root = Tonal.Chord.get(chordName)?.root || ''
    if (!root) return '?'
    const baseKeyIndex = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].indexOf(key.split(/[#b]/)?.[0] || '')    
    if (baseKeyIndex === -1) return '?'
    
    const scaleNotes: string[] = []
    for (let i = 0; i < 7; i++) {
      let semitone = baseNoteSemitone(key) + i * 2
      scaleNotes.push(noteFromSemitone(semitone)?.split(/\d/)?.[0] || '')
    }
    
    return 'I'
  } catch {
    return '?'
  }
}

function baseNoteSemitone(note: string): number {
  const notes: Record<string, number> = {
    C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11
  }
  return notes[note.split(/[#b]/)?.[0] || 'C'] || 0
}

function noteFromSemitone(semitone: number): string {
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  return notes[semitone % 12] || 'C'
}

export function getRelativeMinor(key: string): string {
  try {
    const majorScale = Tonal.Scale.get(`${key} major`)
    if (!majorScale) return key
    return majorScale.notes[6] || key
  } catch {
    return key
  }
}

export function getRelativeMajor(key: string): string {
  try {
    const minorScale = Tonal.Scale.get(`${key} natural minor`)
    if (!minorScale) return key
    return minorScale.notes[3] || key
  } catch {
    return key
  }
}
