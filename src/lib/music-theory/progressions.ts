import * as Tonal from 'tonal'
import type { Chord } from '@/types'

type Quality = 'major' | 'minor' | 'diminished'

const MAJOR_QUALITIES: Quality[] = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished']
const MAJOR_ROMANS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
const MINOR_QUALITIES: Quality[] = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major']
const MINOR_ROMANS = ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII']

function qualitySuffix(q: Quality): string {
  if (q === 'minor') return 'm'
  if (q === 'diminished') return 'dim'
  return ''
}

const INTERVAL_SEMITONES: Record<string, number> = {
  '1P': 0, '2m': 1, '2M': 2, '3m': 3, '3M': 4,
  '4P': 5, '4A': 6, '5d': 6, '5P': 7,
  '6m': 8, '6M': 9, '7m': 10, '7M': 11, '8P': 12,
}

function buildChord(root: string, quality: Quality, roman: string): Chord & { roman: string } {
  const chordName = `${root}${qualitySuffix(quality)}`
  const data = Tonal.Chord.get(chordName)
  return {
    root,
    quality,
    full: chordName,
    notes: data.notes.length > 0 ? data.notes : [root],
    intervals: (data.intervals || []).map((iv: string) => INTERVAL_SEMITONES[iv] ?? 0),
    roman,
  }
}

const MAJOR_PATTERNS: Record<number, number[]> = {
  2:  [0, 4],
  4:  [0, 4, 5, 3],
  6:  [0, 4, 5, 3, 0, 4],
  8:  [0, 4, 5, 3, 0, 2, 4, 3],
  12: [0, 4, 5, 3, 0, 4, 5, 3, 0, 2, 4, 5],
  16: [0, 4, 5, 3, 0, 4, 5, 3, 0, 2, 3, 4, 0, 4, 5, 3],
}

const MINOR_PATTERNS: Record<number, number[]> = {
  2:  [0, 4],
  4:  [0, 6, 3, 4],
  6:  [0, 3, 4, 6, 3, 4],
  8:  [0, 6, 3, 4, 0, 5, 6, 4],
  12: [0, 3, 4, 0, 6, 3, 4, 0, 5, 3, 4, 0],
  16: [0, 3, 4, 6, 0, 3, 4, 0, 6, 3, 4, 0, 3, 5, 6, 4],
}

function getPattern(patterns: Record<number, number[]>, length: number): number[] {
  return patterns[length] ?? Array.from({ length }, (_, i) => i % 7)
}

export function generateMajorProgression(key: string, length: number = 4) {
  const scale = Tonal.Scale.get(`${key} major`)
  const notes = scale.notes.length > 0 ? scale.notes : ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const pattern = getPattern(MAJOR_PATTERNS, length)

  const chords = pattern.map((degree) =>
    buildChord(
      notes[degree] ?? 'C',
      MAJOR_QUALITIES[degree] ?? 'major',
      MAJOR_ROMANS[degree] ?? '?'
    )
  )
  return { chords, key, scaleNotes: notes }
}

export function generateMinorProgression(key: string, length: number = 4) {
  const scale = Tonal.Scale.get(`${key} minor`)
  const notes = scale.notes.length > 0 ? scale.notes : ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']
  const pattern = getPattern(MINOR_PATTERNS, length)

  const chords = pattern.map((degree) =>
    buildChord(
      notes[degree] ?? 'C',
      MINOR_QUALITIES[degree] ?? 'minor',
      MINOR_ROMANS[degree] ?? '?'
    )
  )
  return { chords, key, scaleNotes: notes }
}

export function analyzeProgression(chordNames: string[], key: string) {
  const scale = Tonal.Scale.get(`${key} major`)
  const notes = scale.notes

  const analysis = chordNames.map((chordName) => {
    const root = Tonal.Chord.get(chordName)?.root ?? chordName
    const degree = notes.findIndex(
      (n) => Tonal.Note.pitchClass(n) === Tonal.Note.pitchClass(root)
    )
    return MAJOR_ROMANS[degree] ?? chordName
  })

  return { analysis }
}

export interface ProgressionSuggestion {
  type: 'chord' | 'melody' | 'structure' | 'rhythm'
  content: string
  context: string
  confidence: number
}

const PROGRESSION_LIBRARY: Record<string, ProgressionSuggestion[]> = {
  pop: [
    { type: 'chord', content: 'I – V – vi – IV', context: 'Most popular progression in modern pop music', confidence: 0.95 },
    { type: 'chord', content: 'I – IV – V – I', context: 'Classic resolved cadence — timeless and satisfying', confidence: 0.88 },
    { type: 'chord', content: 'vi – IV – I – V', context: 'Minor-starting variation, builds emotional tension', confidence: 0.84 },
    { type: 'melody', content: 'Start the verse melody on the 5th of the key', context: 'Creates unresolved tension that resolves on the chorus', confidence: 0.79 },
    { type: 'structure', content: 'Key change up a half step for the final chorus', context: 'Classic pop climax technique for emotional lift', confidence: 0.72 },
  ],
  jazz: [
    { type: 'chord', content: 'ii7 – V7 – IMaj7', context: 'Foundation of jazz harmony, always resolves cleanly', confidence: 0.96 },
    { type: 'chord', content: 'IMaj7 – VI7 – ii7 – V7', context: 'Rhythm changes turnaround', confidence: 0.90 },
    { type: 'chord', content: 'iii7 – VI7 – ii7 – V7', context: 'Extended turnaround with chromatic pull', confidence: 0.85 },
    { type: 'melody', content: 'Use chord tones on strong beats, passing tones on weak', context: 'Bebop melodic approach for linear improvisation', confidence: 0.88 },
  ],
  blues: [
    { type: 'chord', content: 'I7 – IV7 – I7 – V7 – IV7 – I7', context: '12-bar blues — the foundation of the genre', confidence: 0.98 },
    { type: 'chord', content: 'i7 – iv7 – V7', context: 'Minor blues — darker, more melancholic feel', confidence: 0.87 },
    { type: 'melody', content: 'Use the blues scale (♭3, ♭5, ♭7) over dominant chords', context: 'Creates the signature blues tension and release', confidence: 0.91 },
  ],
  rock: [
    { type: 'chord', content: 'I – V – IV – I', context: 'Classic rock power chord foundation', confidence: 0.93 },
    { type: 'chord', content: 'i – ♭VI – ♭III – ♭VII', context: 'Epic minor rock progression', confidence: 0.86 },
    { type: 'chord', content: 'I – IV – I – V', context: 'Blues-rock foundation', confidence: 0.88 },
    { type: 'rhythm', content: 'Syncopate the guitar riff against the kick drum', context: 'Creates the drive and groove of classic rock', confidence: 0.82 },
  ],
  classical: [
    { type: 'chord', content: 'I – IV – V – I', context: 'Authentic cadence — the most resolved ending', confidence: 0.95 },
    { type: 'chord', content: 'i – ii° – V – i', context: 'Minor authentic cadence', confidence: 0.92 },
    { type: 'chord', content: 'IV – I', context: 'Plagal (Amen) cadence — gentle resolution', confidence: 0.88 },
    { type: 'melody', content: 'Voice-lead smoothly: move each voice by step when possible', context: 'The basis of classical counterpoint', confidence: 0.90 },
  ],
  folk: [
    { type: 'chord', content: 'I – IV – V – I', context: 'Traditional folk — open, honest, and timeless', confidence: 0.92 },
    { type: 'chord', content: 'I – vi – IV – V', context: 'Folk ballad / doo-wop — warm and nostalgic', confidence: 0.85 },
    { type: 'melody', content: 'Use pentatonic scale for simple, singable melodies', context: 'Works over any folk progression effortlessly', confidence: 0.88 },
    { type: 'structure', content: 'Repeat the verse chord sequence for the chorus', context: 'Traditional folk contrast via lyrics, not harmony', confidence: 0.75 },
  ],
}

export function suggestProgressions(key: string, style: string = 'pop'): ProgressionSuggestion[] {
  const suggestions = PROGRESSION_LIBRARY[style] ?? PROGRESSION_LIBRARY.pop!
  return suggestions.map((p) => ({ ...p, context: `In ${key}: ${p.context}` }))
}

export function getScaleNotes(scaleName: string = 'C major') {
  try {
    const scale = Tonal.Scale.get(scaleName)
    return { notes: scale.notes }
  } catch {
    return { notes: [] as string[] }
  }
}

export default {
  generateMajorProgression,
  generateMinorProgression,
  analyzeProgression,
  suggestProgressions,
  getScaleNotes,
}

