import * as Tone from 'tone'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Fb: 'E', Gb: 'F#', Ab: 'G#', Bb: 'A#', Cb: 'B',
}

// ── Piano: Salamander Grand Piano samples ───────────────────
let pianoSampler: Tone.Sampler | null = null

function getPiano(): Tone.Sampler {
  if (!pianoSampler) {
    const reverb = new Tone.Reverb({ decay: 2.5 }).toDestination()
    reverb.wet.value = 0.12
    pianoSampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
        A1: 'A1.mp3', C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
        A2: 'A2.mp3', C3: 'C3.mp3', 'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
        A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
        A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
        A5: 'A5.mp3', C6: 'C6.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      volume: -6,
    }).connect(reverb)
  }
  return pianoSampler
}

// ── Guitar: PluckSynth (Karplus-Strong) + reverb ────────────
let guitarPluck: Tone.PluckSynth | null = null

function getGuitar(): Tone.PluckSynth {
  if (!guitarPluck) {
    const reverb = new Tone.Reverb({ decay: 1.8 }).toDestination()
    reverb.wet.value = 0.28
    guitarPluck = new Tone.PluckSynth({
      attackNoise: 2,
      dampening: 3000,
      resonance: 0.985,
      volume: -2,
    }).connect(reverb)
  }
  return guitarPluck
}

// ── Single note playback ────────────────────────────────────
export async function playPianoNote(noteIndex: number, octave = 4, duration = '8n'): Promise<void> {
  await Tone.start()
  await Tone.loaded()
  getPiano().triggerAttackRelease(`${NOTE_NAMES[noteIndex]}${octave}`, duration)
}

export async function playGuitarNote(noteIndex: number, octave = 3, duration = '4n'): Promise<void> {
  await Tone.start()
  getGuitar().triggerAttackRelease(`${NOTE_NAMES[noteIndex]}${octave}`, duration)
}

// ── Chord playback ──────────────────────────────────────────
export async function playPianoChord(noteNames: string[], duration = '2n'): Promise<void> {
  await Tone.start()
  await Tone.loaded()
  getPiano().triggerAttackRelease(noteNames, duration)
}

export async function playGuitarChord(noteNames: string[], duration = '2n'): Promise<void> {
  await Tone.start()
  const now = Tone.now()
  const guitar = getGuitar()
  noteNames.forEach((note, i) => guitar.triggerAttackRelease(note, duration, now + i * 0.04))
}

// ── Map chord note names to octave-aware strings ────────────
export function chordNotesToNoteNames(chordNotes: string[], instrument: 'piano' | 'guitar'): string[] {
  if (instrument === 'piano') {
    return chordNotes.slice(0, 4).map((note, i) => {
      const octave = i === 0 ? 3 : i <= 2 ? 4 : 5
      return `${note}${octave}`
    })
  }
  return chordNotes.slice(0, 4).map((note, i) => `${note}${i <= 1 ? 2 : 3}`)
}

// ── Progression playback (for Inspiration tab) ──────────────
// Parses chord names from a text string, e.g. "Try C - Am - F - G"
function parseChordList(text: string): Array<{ root: string; isMinor: boolean }> {
  const pattern = /\b([A-G][#b]?)(maj7|m7|min7|maj|min|dim|aug|sus[24]|add9|\d+|m)?\b/g
  const results: Array<{ root: string; isMinor: boolean }> = []
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text)) !== null) {
    const root = FLAT_TO_SHARP[m[1]] ?? m[1]
    if (!NOTE_NAMES.includes(root)) continue
    const suffix = m[2] ?? ''
    const isMinor = suffix === 'm' || suffix === 'm7' || suffix === 'min' || suffix === 'min7' || suffix === 'dim'
    results.push({ root, isMinor })
  }
  return results
}

function buildTriad(root: string, isMinor: boolean, instrument: 'piano' | 'guitar'): string[] {
  const rootIdx = NOTE_NAMES.indexOf(root)
  if (rootIdx === -1) return []
  const third = isMinor ? 3 : 4
  const base = instrument === 'piano' ? 4 : 2
  const thirdIdx = (rootIdx + third) % 12
  const thirdOct = base + (rootIdx + third >= 12 ? 1 : 0)
  const fifthIdx = (rootIdx + 7) % 12
  const fifthOct = base + (rootIdx + 7 >= 12 ? 1 : 0)
  return [`${root}${base}`, `${NOTE_NAMES[thirdIdx]}${thirdOct}`, `${NOTE_NAMES[fifthIdx]}${fifthOct}`]
}

export async function playProgression(
  text: string,
  instrument: 'piano' | 'guitar',
  intervalMs = 1500,
): Promise<void> {
  await Tone.start()
  await Tone.loaded()
  const chords = parseChordList(text)
  for (let i = 0; i < chords.length; i++) {
    if (i > 0) await new Promise<void>(r => setTimeout(r, intervalMs))
    const notes = buildTriad(chords[i].root, chords[i].isMinor, instrument)
    if (notes.length === 0) continue
    if (instrument === 'piano') {
      getPiano().triggerAttackRelease(notes, '2n')
    } else {
      const now = Tone.now()
      notes.forEach((note, idx) => getGuitar().triggerAttackRelease(note, '2n', now + idx * 0.04))
    }
  }
}
