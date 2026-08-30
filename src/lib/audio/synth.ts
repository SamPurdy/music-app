import * as Tone from 'tone'
import { NOTE_NAMES, FLAT_TO_SHARP, getChordNotes } from '@/lib/music-theory/notes'

// ── Piano: Salamander Grand Piano samples ────────────────────
let pianoSampler: Tone.Sampler | null = null
let pianoReverb: Tone.Reverb | null = null

function getPiano(): Tone.Sampler {
  if (!pianoSampler) {
    pianoReverb = new Tone.Reverb({ decay: 2.5 }).toDestination()
    pianoReverb.wet.value = 0.12
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
    }).connect(pianoReverb)
  }
  return pianoSampler
}

// ── Guitar: FluidR3 acoustic steel guitar sampler ────────────
// Falls back to PluckSynth only while the sampler CDN samples are loading.
let guitarSampler: Tone.Sampler | null = null
let guitarSamplerReverb: Tone.Reverb | null = null
let guitarSamplerReady = false
let guitarPluckFallback: Tone.PluckSynth | null = null
let guitarPluckReverb: Tone.Reverb | null = null

function getGuitarPluck(): Tone.PluckSynth {
  if (!guitarPluckFallback) {
    guitarPluckReverb = new Tone.Reverb({ decay: 1.2 }).toDestination()
    guitarPluckReverb.wet.value = 0.2
    guitarPluckFallback = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.98,
      volume: -4,
    }).connect(guitarPluckReverb)
  }
  return guitarPluckFallback
}

function getGuitarSampler(): Tone.Sampler {
  if (!guitarSampler) {
    guitarSamplerReverb = new Tone.Reverb({ decay: 1.8, preDelay: 0.01 }).toDestination()
    guitarSamplerReverb.wet.value = 0.22
    // FluidR3 GM acoustic steel guitar samples via gleitz CDN.
    // Sampler interpolates between these key sample points across the full range.
    guitarSampler = new Tone.Sampler({
      urls: {
        E2: 'E2.mp3',
        A2: 'A2.mp3',
        D3: 'D3.mp3',
        G3: 'G3.mp3',
        B3: 'B3.mp3',
        E4: 'E4.mp3',
        A4: 'A4.mp3',
        D5: 'D5.mp3',
      },
      baseUrl: 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/acoustic_guitar_steel-mp3/',
      onload: () => { guitarSamplerReady = true },
      volume: -2,
    }).connect(guitarSamplerReverb)
  }
  return guitarSampler
}

// ── Single note playback ─────────────────────────────────────

// Piano: '2n' (half note) so keys ring long enough to hear in theory/exploration mode.
// Pass a shorter duration explicitly if you need a quick percussive hit.
export async function playPianoNote(noteIndex: number, octave = 4, duration = '2n'): Promise<void> {
  await Tone.start()
  const piano = getPiano()
  if (pianoReverb) await pianoReverb.ready
  await Tone.loaded()
  piano.triggerAttackRelease(`${NOTE_NAMES[noteIndex]}${octave}`, duration)
}

// Guitar picked string — for fretboard / scale exploration.
// Uses the acoustic sampler (warm, natural decay). Falls back to PluckSynth while loading.
export async function playGuitarNote(noteIndex: number, octave = 3): Promise<void> {
  await Tone.start()
  if (Tone.context.state !== 'running') {
    await new Promise<void>(r => setTimeout(r, 80))
  }
  const noteName = `${NOTE_NAMES[noteIndex]}${octave}`
  if (guitarSamplerReady) {
    const sampler = getGuitarSampler()
    if (guitarSamplerReverb) await guitarSamplerReverb.ready
    sampler.triggerAttackRelease(noteName, '2n')
  } else {
    // Trigger load and use PluckSynth this time
    getGuitarSampler()
    const pluck = getGuitarPluck()
    if (guitarPluckReverb) await guitarPluckReverb.ready
    pluck.triggerAttackRelease(noteName, '4n')
  }
}

// ── Metronome Click Synth ────────────────────────────────────
let metronomeSynth: Tone.Synth | null = null

function getMetronome(): Tone.Synth {
  if (!metronomeSynth) {
    metronomeSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.002,
        decay: 0.025,
        sustain: 0,
        release: 0.01,
      },
      volume: -14, // Soft background reference level
    }).toDestination()
  }
  return metronomeSynth
}

export function playMetronomeClick(isAccent = false, time?: number): void {
  try {
    const synth = getMetronome()
    const note = isAccent ? 'A5' : 'E5'
    const duration = 0.025
    const velocity = isAccent ? 0.6 : 0.35
    if (time !== undefined) {
      synth.triggerAttackRelease(note, duration, time, velocity)
    } else {
      synth.triggerAttackRelease(note, duration, undefined, velocity)
    }
  } catch (e) {
    console.warn('Metronome click error:', e)
  }
}

// ── Chord playback ──────────────────────────────────────────

export async function playPianoChord(noteNames: string[], duration: string | number = '2n'): Promise<void> {
  await Tone.start()
  const piano = getPiano()
  if (pianoReverb) await pianoReverb.ready
  await Tone.loaded()
  piano.triggerAttackRelease(noteNames, duration)
}

// Strummed acoustic guitar chord: notes staggered low-to-high (45ms per string).
export async function playGuitarChord(noteNames: string[], duration: string | number = '2n'): Promise<void> {
  await Tone.start()
  if (Tone.context.state !== 'running') {
    await new Promise<void>(r => setTimeout(r, 80))
  }
  const now = Tone.now()
  const strumDelay = 0.045 // 45ms between strings — natural acoustic strum feel

  if (guitarSamplerReady) {
    const sampler = getGuitarSampler()
    if (guitarSamplerReverb) await guitarSamplerReverb.ready
    noteNames.forEach((note, i) => {
      sampler.triggerAttackRelease(note, duration, now + i * strumDelay)
    })
  } else {
    // Trigger load and fall back to PluckSynth strum
    getGuitarSampler()
    const pluck = getGuitarPluck()
    if (guitarPluckReverb) await guitarPluckReverb.ready
    noteNames.forEach((note, i) => pluck.triggerAttackRelease(note, duration, now + i * 0.04))
  }
}

// ── Map chord note names to octave-aware strings ────────────
export function chordNotesToNoteNames(chordNotes: string[], instrument: 'piano' | 'guitar'): string[] {
  if (instrument === 'piano') {
    return chordNotes.slice(0, 4).map((note, i) => {
      const octave = i === 0 ? 3 : i <= 2 ? 4 : 5
      return `${note}${octave}`
    })
  }
  return chordNotes.slice(0, 4).map((note, i) => `${note}${i <= 1 ? 3 : 4}`)
}

// ── Ensure Instrument/Reverb is loaded and ready ───────────────
export async function ensureInstrumentLoaded(instrument: 'piano' | 'guitar'): Promise<void> {
  await Tone.start()
  if (instrument === 'piano') {
    getPiano()
    if (pianoReverb) await pianoReverb.ready
  } else {
    getGuitarSampler()
    if (guitarSamplerReverb) await guitarSamplerReverb.ready
  }
  await Tone.loaded()
}

// ── Progression playback (Inspiration tab) ──────────────────
function parseChordList(text: string): string[] {
  const pattern = /\b([A-G][#b]?)(maj7|m7|min7|maj|min|dim|aug|sus[24]|add9|\d+|m)?\b/g
  const results: string[] = []
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text)) !== null) {
    const root = FLAT_TO_SHARP[m[1]] ?? m[1]
    const suffix = m[2] ?? ''
    results.push(root + suffix)
  }
  return results
}

export async function playProgression(
  text: string,
  instrument: 'piano' | 'guitar',
  intervalMs = 1500,
): Promise<void> {
  await ensureInstrumentLoaded(instrument)
  const chords = parseChordList(text)
  for (let i = 0; i < chords.length; i++) {
    if (i > 0) await new Promise<void>(r => setTimeout(r, intervalMs))
    const chordNotes = getChordNotes(chords[i])
    if (chordNotes.length === 0) continue
    const notes = chordNotesToNoteNames(chordNotes, instrument)
    if (notes.length === 0) continue
    if (instrument === 'piano') {
      getPiano().triggerAttackRelease(notes, '2n')
    } else {
      await playGuitarChord(notes)
    }
  }
}