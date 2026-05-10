import * as Tone from 'tone'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Lazy synth instances
let pianoPoly: Tone.PolySynth | null = null
let guitarPluck: Tone.PluckSynth | null = null

function getPiano(): Tone.PolySynth {
  if (!pianoPoly) {
    pianoPoly = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.8, sustain: 0.3, release: 1.5 },
      volume: -6,
    }).toDestination()
  }
  return pianoPoly
}

function getGuitar(): Tone.PluckSynth {
  if (!guitarPluck) {
    guitarPluck = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.98,
      volume: -4,
    }).toDestination()
  }
  return guitarPluck
}

export async function playPianoNote(noteIndex: number, octave = 4, duration = '8n'): Promise<void> {
  await Tone.start()
  const noteName = `${NOTE_NAMES[noteIndex]}${octave}`
  getPiano().triggerAttackRelease(noteName, duration)
}

export async function playGuitarNote(noteIndex: number, octave = 3, duration = '4n'): Promise<void> {
  await Tone.start()
  const noteName = `${NOTE_NAMES[noteIndex]}${octave}`
  getGuitar().triggerAttackRelease(noteName, duration)
}

export async function playPianoChord(noteNames: string[], duration = '2n'): Promise<void> {
  await Tone.start()
  getPiano().triggerAttackRelease(noteNames, duration)
}

export async function playGuitarChord(noteNames: string[], duration = '2n'): Promise<void> {
  await Tone.start()
  const now = Tone.now()
  const guitar = getGuitar()
  noteNames.forEach((note, i) => {
    guitar.triggerAttackRelease(note, duration, now + i * 0.04)
  })
}

export function chordNotesToNoteNames(chordNotes: string[], instrument: 'piano' | 'guitar'): string[] {
  if (instrument === 'piano') {
    return chordNotes.slice(0, 4).map((noteName, i) => {
      const idx = NOTE_NAMES.indexOf(noteName)
      if (idx === -1) return `${noteName}4`
      const octave = i === 0 ? 3 : i <= 2 ? 4 : 5
      return `${noteName}${octave}`
    })
  } else {
    return chordNotes.slice(0, 4).map((noteName, i) => {
      const idx = NOTE_NAMES.indexOf(noteName)
      if (idx === -1) return `${noteName}2`
      const octave = i === 0 ? 2 : i === 1 ? 2 : i === 2 ? 3 : 3
      return `${noteName}${octave}`
    })
  }
}
