// Define locally - DO NOT import NOTE_NAMES from notes.ts (wrong format)
const SHARP_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export interface ScaleDefinition {
  name: string
  intervals: number[]  // semitones from root, NOT including the root itself
  description: string
  genre: string
  mood: string
}

export const SCALES: Record<string, ScaleDefinition> = {
  major:           { name: 'Major',            intervals: [2,4,5,7,9,11],     description: 'The foundation of Western music, bright and resolved.',        genre: 'Pop, Classical, Rock, Country', mood: 'Happy, Bright, Uplifting' },
  naturalMinor:    { name: 'Natural Minor',     intervals: [2,3,5,7,8,10],     description: 'Darker counterpart to the major, emotionally rich.',            genre: 'Rock, Blues, Pop, Classical',   mood: 'Sad, Dark, Emotional' },
  harmonicMinor:   { name: 'Harmonic Minor',    intervals: [2,3,5,7,8,11],     description: 'Natural minor with raised 7th — dramatic augmented 2nd gap.',   genre: 'Classical, Metal, Flamenco',    mood: 'Dramatic, Exotic, Tense' },
  melodicMinor:    { name: 'Melodic Minor',     intervals: [2,3,5,7,9,11],     description: 'Minor with raised 6th & 7th for smooth melodic movement.',       genre: 'Jazz, Classical',               mood: 'Sophisticated, Bittersweet' },
  majorPentatonic: { name: 'Major Pentatonic',  intervals: [2,4,7,9],          description: 'Five-note major scale without 4th and 7th. Universal.',         genre: 'Country, Folk, Pop, Rock',      mood: 'Happy, Open, Simple' },
  minorPentatonic: { name: 'Minor Pentatonic',  intervals: [3,5,7,10],         description: 'Go-to scale for rock and blues solos. Five notes, max impact.', genre: 'Blues, Rock, Metal',            mood: 'Raw, Powerful, Gritty' },
  blues:           { name: 'Blues',             intervals: [3,5,6,7,10],       description: 'Minor pentatonic plus the blue note (b5).',                      genre: 'Blues, Rock, Jazz',             mood: 'Soulful, Expressive, Raw' },
  dorian:          { name: 'Dorian',            intervals: [2,3,5,7,9,10],     description: 'Minor mode with raised 6th — cool and jazzy.',                  genre: 'Jazz, Rock, Funk',              mood: 'Cool, Sophisticated, Groovy' },
  phrygian:        { name: 'Phrygian',          intervals: [1,3,5,7,8,10],     description: 'Minor mode with flattened 2nd — dark Spanish flavour.',         genre: 'Metal, Flamenco, Electronic',   mood: 'Dark, Exotic, Mysterious' },
  lydian:          { name: 'Lydian',            intervals: [2,4,6,7,9,11],     description: 'Major mode with raised 4th — dreamy and otherworldly.',          genre: 'Film, Jazz, Progressive',       mood: 'Dreamy, Bright, Magical' },
  mixolydian:      { name: 'Mixolydian',        intervals: [2,4,5,7,9,10],     description: 'Major scale with flattened 7th — rock and blues staple.',        genre: 'Rock, Blues, Folk',             mood: 'Bluesy, Confident, Rebellious' },
  locrian:         { name: 'Locrian',           intervals: [1,3,5,6,8,10],     description: 'Most dissonant mode. Extreme tension, rarely used.',             genre: 'Metal, Experimental',           mood: 'Unstable, Tense, Dissonant' },
  wholeTone:       { name: 'Whole Tone',        intervals: [2,4,6,8,10],       description: 'All whole steps — floating, ambiguous sound.',                   genre: 'Jazz, Impressionist',           mood: 'Dreamy, Ambiguous, Floating' },
  diminished:      { name: 'Diminished',        intervals: [2,3,5,6,8,9,11],   description: 'Alternating whole & half steps — symmetric and tension-filled.', genre: 'Jazz, Metal, Classical',        mood: 'Tense, Unstable, Dramatic' },
}

export function getScaleNoteNames(root: string, scaleKey: string): string[] {
  const scale = SCALES[scaleKey]
  if (!scale) return []
  const rootIdx = SHARP_NOTE_NAMES.indexOf(root)
  if (rootIdx === -1) return []
  return [SHARP_NOTE_NAMES[rootIdx], ...scale.intervals.map(i => SHARP_NOTE_NAMES[(rootIdx + i) % 12])]
}

export function getScaleNoteIndices(root: string, scaleKey: string): number[] {
  const scale = SCALES[scaleKey]
  if (!scale) return []
  const rootIdx = SHARP_NOTE_NAMES.indexOf(root)
  if (rootIdx === -1) return []
  return [rootIdx, ...scale.intervals.map(i => (rootIdx + i) % 12)]
}
