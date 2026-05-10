export interface Note {
  name: string
  octave: number
  frequency?: number
}

export interface Chord {
  root: string
  quality: string
  full: string
  notes: string[]
  intervals: number[]
  roman?: string
}

export interface ChordProgression {
  chords: Chord[]
  key: string
  RomanNumeralAnalysis: string[]
}

export interface SongSection {
  id: string
  name: string
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'outro' | 'hook' | 'fill'
  chords?: ChordProgression
  lyrics: string[]
  tempo: number
  timeSignature: [number, number]
  repeats: number
}

export interface Song {
  id: string
  title: string
  key: string
  tempo: number
  timeSignature: [number, number]
  sections: SongSection[]
  createdAt: Date
  updatedAt: Date
}

export interface Scale {
  name: string
  intervals: number[]
  notes: string[]
}

export interface Mode {
  name: string
  parentScale: string
  intervals: number[]
  notes: string[]
}

export interface VoiceLeading {
  from: Chord
  to: Chord
  voices: Voice[]
}

export interface Voice {
  fromNote: string
  toNote: string
  motion: 'common' | 'step' | 'skip' | 'leap'
}

export interface ChordSubstitution {
  original: Chord
  substitution: Chord
  reason: string
  romanNumeral?: string
}

export interface MidiExportOptions {
  tempo: number
  key: string
  trackName?: string
  instrument?: string
  quantization?: number
}

export interface CreativeSuggestion {
  type: 'chord' | 'lyric' | 'melody' | 'structure' | 'rhythm'
  content: string
  context: string
  confidence: number
}

export interface SongTransition {
  name: string
  type: 'fade' | 'cut' | 'swing'
  length?: number
}
