import { Midi } from '@tonejs/midi'
import * as Tonal from 'tonal'

// Helper to get notes of a chord
function getMidiNotesForChord(chordName: string): string[] {
  try {
    const chord = Tonal.Chord.get(chordName)
    if (!chord || chord.empty) return []
    const notes = chord.notes // e.g. ["C", "E", "G", "B"]
    const root = chord.root // e.g. "C"
    
    const midiNotes: string[] = []
    // Add bass note at octave 3
    if (root) {
      midiNotes.push(`${root}3`)
    }
    // Add voicing notes at octave 4
    notes.forEach(note => {
      midiNotes.push(`${note}4`)
    })
    return midiNotes
  } catch {
    return []
  }
}

// Download function helper
function downloadMidi(midi: Midi, filename: string) {
  const binary = midi.toArray()
  const blob = new Blob([binary] as any, { type: 'audio/midi' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.mid') ? filename : `${filename}.mid`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Exports a list of chords as a MIDI file
 */
export function exportProgressionToMidi(
  chords: string[],
  key: string,
  tempo: number = 120,
  filename = 'progression'
) {
  const midi = new Midi()
  midi.header.name = `Progression in ${key}`
  midi.header.setTempo(tempo)

  const track = midi.addTrack()
  track.name = 'Chords'

  // Each chord plays for 4 beats (1 bar)
  const beatsPerChord = 4
  const secondsPerBeat = 60 / tempo
  const duration = beatsPerChord * secondsPerBeat

  chords.forEach((chordName, index) => {
    const notes = getMidiNotesForChord(chordName)
    const time = index * duration

    notes.forEach(noteName => {
      track.addNote({
        name: noteName,
        time: time,
        duration: duration,
        velocity: 0.8
      })
    })
  })

  downloadMidi(midi, filename)
}

/**
 * Exports a full song structure to a MIDI file
 */
export interface SongSection {
  name: string
  bars: number
  chords: string
}

export function exportSongToMidi(
  title: string,
  key: string,
  tempo: number,
  sections: SongSection[],
  filename?: string
) {
  const midi = new Midi()
  midi.header.name = title
  midi.header.setTempo(tempo)

  const track = midi.addTrack()
  track.name = `Song Chords (${key})`

  const secondsPerBeat = 60 / tempo
  let currentBeat = 0

  sections.forEach(section => {
    const chordList = section.chords
      .split(/[\s,]+/)
      .filter(Boolean)
    
    const numChords = chordList.length
    const totalBeats = section.bars * 4

    if (numChords > 0) {
      const beatsPerChord = totalBeats / numChords
      const duration = beatsPerChord * secondsPerBeat

      chordList.forEach((chordName, index) => {
        const notes = getMidiNotesForChord(chordName)
        const startBeat = currentBeat + index * beatsPerChord
        const time = startBeat * secondsPerBeat

        notes.forEach(noteName => {
          track.addNote({
            name: noteName,
            time: time,
            duration: duration,
            velocity: 0.8
          })
        })
      })
    }

    currentBeat += totalBeats
  })

  const downloadName = filename || title.replace(/\s+/g, '-').toLowerCase()
  downloadMidi(midi, downloadName)
}
