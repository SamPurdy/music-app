export interface MidiTrack {
  name: string
  notes: { pitch: number; time: number; duration: number }[]
}

interface ChordInternal {
  root: string
  quality: string
}

export function generateMidiFromProgression(
  progression: { chords: ChordInternal[]; key: string },
  options: { tempo: number; key: string },
): MidiTrack {
  const chordTrack: MidiTrack = { name: `Chords in ${options.key}`, notes: [] }
  
  for (const chord of progression.chords) {
    const rootMidiIndex = getNoteMidi(chord.root || options.key)
    
    if (rootMidiIndex === undefined) continue
    
    const baseMidi = (5) * 12 + rootMidiIndex
    const bassMidi = (4) * 12 + rootMidiIndex
    
    chordTrack.notes.push({ pitch: bassMidi, time: 0, duration: 1 })
  }
  
  return chordTrack
}

function getNoteMidi(note: string): number {
  const noteNames = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  const baseIndex = noteNames.findIndex(n => n.toLowerCase() === (note || '').split(/\d/)?.[0]?.replace('#', '').replace('b', '')?.toLowerCase())
  return baseIndex !== -1 ? baseIndex : 0
}
