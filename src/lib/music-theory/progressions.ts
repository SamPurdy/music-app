import * as Tonal from 'tonal'
import type { Chord, CreativeSuggestion } from '@/types'

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

// Maps Roman numeral tokens to [scale degree index, quality].
// Covers all numerals used in PROGRESSION_LIBRARY including jazz/extended forms.
const MAJOR_ROMAN_MAP: Record<string, [number, Quality]> = {
  'I':     [0, 'major'],
  'I7':    [0, 'major'],
  'IMaj7': [0, 'major'],
  'ii':    [1, 'minor'],
  'ii7':   [1, 'minor'],
  'iii':   [2, 'minor'],
  'iii7':  [2, 'minor'],
  'IV':    [3, 'major'],
  'IV7':   [3, 'major'],
  'V':     [4, 'major'],
  'V7':    [4, 'major'],
  'vi':    [5, 'minor'],
  'VI7':   [5, 'major'], // secondary dominant
  'vii°':  [6, 'diminished'],
}

const MINOR_ROMAN_MAP: Record<string, [number, Quality]> = {
  'i':     [0, 'minor'],
  'i7':    [0, 'minor'],
  'ii°':   [1, 'diminished'],
  '♭III':  [2, 'major'],
  'iv':    [3, 'minor'],
  'iv7':   [3, 'minor'],
  'v':     [4, 'minor'],
  '♭VI':   [5, 'major'],
  '♭VII':  [6, 'major'],
}

/**
 * Convert a Roman numeral pattern string (e.g. "I – V – vi – IV") into
 * actual chord names for the given key and scale type.
 * Handles "Try " prefix, en-dash/em-dash/hyphen separators, and extended numerals.
 */
export function romanToChords(pattern: string, key: string, scaleType: 'major' | 'minor' = 'major'): string[] {
  const cleaned = pattern.replace(/^try\s+/i, '')
  const tokens = cleaned.split(/\s*[–—\-]\s*|\s+/).map(t => t.trim()).filter(Boolean)

  const scale = Tonal.Scale.get(`${key} ${scaleType}`)
  const fallback = scaleType === 'major'
    ? ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    : ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']
  const notes = scale.notes.length > 0 ? scale.notes : fallback

  const romanMap = scaleType === 'minor'
    ? { ...MAJOR_ROMAN_MAP, ...MINOR_ROMAN_MAP }
    : MAJOR_ROMAN_MAP

  return tokens.flatMap(token => {
    const entry = romanMap[token]
    if (!entry) return []
    const [degree, quality] = entry
    const root = notes[degree] ?? 'C'
    return [`${root}${qualitySuffix(quality)}`]
  })
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

export function generateRandomProgression(
  key: string,
  length: number = 4,
  scaleType: 'major' | 'minor' = 'major'
): { chords: (Chord & { roman: string })[]; key: string; scaleNotes: string[] } {
  const isMinor = scaleType === 'minor'
  const scale = Tonal.Scale.get(`${key} ${scaleType}`)
  const notes = scale.notes.length > 0 ? scale.notes : (isMinor ? ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'] : ['C', 'D', 'E', 'F', 'G', 'A', 'B'])
  const qualities = isMinor ? MINOR_QUALITIES : MAJOR_QUALITIES
  const romans = isMinor ? MINOR_ROMANS : MAJOR_ROMANS

  const chords: (Chord & { roman: string })[] = []
  let lastRootIndex = -1

  for (let i = 0; i < length; i++) {
    const preferredIndices = [lastRootIndex, (lastRootIndex + 3) % 7, (lastRootIndex + 5) % 7]

    let selectedIndex: number
    if (i === 0) {
      selectedIndex = Math.floor(Math.random() * notes.length)
    } else {
      const availableIndices = preferredIndices.filter(idx => idx >= 0 && idx < notes.length)
      selectedIndex = availableIndices.length > 0
        ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
        : Math.floor(Math.random() * notes.length)
    }

    lastRootIndex = selectedIndex
    const root = notes[selectedIndex]
    const quality = qualities[selectedIndex] ?? (isMinor ? 'minor' : 'major')
    const roman = romans[selectedIndex] ?? '?'
    chords.push(buildChord(root, quality, roman))
  }

  return { chords, key, scaleNotes: notes }
}

export function analyzeProgression(
  chordNames: string[],
  key: string,
  scaleType: 'major' | 'minor' = 'major'
): { analysis: string[] } {
  const scale = Tonal.Scale.get(`${key} ${scaleType}`)
  const notes = scale.notes
  const romans = scaleType === 'minor' ? MINOR_ROMANS : MAJOR_ROMANS

  const analysis = chordNames.map((chordName) => {
    const root = Tonal.Chord.get(chordName)?.root ?? chordName
    const degree = notes.findIndex(
      (n) => Tonal.Note.pitchClass(n) === Tonal.Note.pitchClass(root)
    )
    if (degree === -1) return chordName
    return romans[degree] ?? chordName
  })

  return { analysis }
}

const PROGRESSION_LIBRARY: Record<string, CreativeSuggestion[]> = {
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

export function suggestProgressions(key: string, style: string = 'pop'): CreativeSuggestion[] {
  const suggestions = PROGRESSION_LIBRARY[style] ?? PROGRESSION_LIBRARY.pop!
  return suggestions.map((p) => ({ ...p, context: `In ${key}: ${p.context}` }))
}

export default {
  generateMajorProgression,
  generateMinorProgression,
  analyzeProgression,
  suggestProgressions,
}