export interface IntervalDefinition {
  semitones: number
  shortName: string
  fullName: string
  symbol: string
  consonance: 'perfect' | 'consonant' | 'dissonant'
  description: string
  example: string
}

export const INTERVALS: IntervalDefinition[] = [
  { semitones: 0,  shortName: 'P1',  fullName: 'Perfect Unison',   symbol: 'P1',  consonance: 'perfect',    description: 'Same pitch',                             example: 'C → C'  },
  { semitones: 1,  shortName: 'm2',  fullName: 'Minor Second',      symbol: 'm2',  consonance: 'dissonant',  description: 'Half step, maximum tension',             example: 'C → C#' },
  { semitones: 2,  shortName: 'M2',  fullName: 'Major Second',      symbol: 'M2',  consonance: 'dissonant',  description: 'Whole step, mild tension',               example: 'C → D'  },
  { semitones: 3,  shortName: 'm3',  fullName: 'Minor Third',       symbol: 'm3',  consonance: 'consonant',  description: 'Minor chord quality, somber',            example: 'C → D#' },
  { semitones: 4,  shortName: 'M3',  fullName: 'Major Third',       symbol: 'M3',  consonance: 'consonant',  description: 'Major chord quality, bright',            example: 'C → E'  },
  { semitones: 5,  shortName: 'P4',  fullName: 'Perfect Fourth',    symbol: 'P4',  consonance: 'perfect',    description: 'Strong, stable interval',                example: 'C → F'  },
  { semitones: 6,  shortName: 'TT',  fullName: 'Tritone',           symbol: 'TT',  consonance: 'dissonant',  description: "Devil's interval — maximum dissonance",  example: 'C → F#' },
  { semitones: 7,  shortName: 'P5',  fullName: 'Perfect Fifth',     symbol: 'P5',  consonance: 'perfect',    description: 'Most consonant interval after unison',   example: 'C → G'  },
  { semitones: 8,  shortName: 'm6',  fullName: 'Minor Sixth',       symbol: 'm6',  consonance: 'consonant',  description: 'Inverted major third, melancholic',      example: 'C → G#' },
  { semitones: 9,  shortName: 'M6',  fullName: 'Major Sixth',       symbol: 'M6',  consonance: 'consonant',  description: 'Inverted minor third, bright',           example: 'C → A'  },
  { semitones: 10, shortName: 'm7',  fullName: 'Minor Seventh',     symbol: 'm7',  consonance: 'dissonant',  description: 'Dominant 7th chord tone, bluesy',        example: 'C → A#' },
  { semitones: 11, shortName: 'M7',  fullName: 'Major Seventh',     symbol: 'M7',  consonance: 'dissonant',  description: 'Leading tone to octave, bright tension', example: 'C → B'  },
  { semitones: 12, shortName: 'P8',  fullName: 'Perfect Octave',    symbol: 'P8',  consonance: 'perfect',    description: 'Same note one octave up',                example: "C → C'" },
]
