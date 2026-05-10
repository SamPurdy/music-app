import type { Chord } from '@/types'

export interface MidiTrack {
  name: string
  notes: { pitch: number; time: number; duration: number }[]
}

export function generateMidiFromProgression(
  progression: { chords: Chord[]; key: string },
  options: { tempo: number; key: string },
): MidiTrack {
  const chordTrack: MidiTrack = { name: `Chords in ${options.key}`, notes: [] }
  let time = 0
  for (const chord of progression.chords) {
    const rootMidiIndex = getNoteMidi(chord.root || options.key)
    const bassMidi = 4 * 12 + rootMidiIndex
    chordTrack.notes.push({ pitch: bassMidi, time, duration: 1 })
    time += 1
  }
  return chordTrack
}

function getNoteMidi(note: string): number {
  const noteNames = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  const pitchClass = (note || '').split(/\d/)[0] ?? ''
  const baseIndex = noteNames.findIndex(n => n.toLowerCase() === pitchClass.toLowerCase())
  return baseIndex !== -1 ? baseIndex : 0
}
