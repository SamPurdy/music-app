import type { Chord, Voice } from '@/types'
import { NOTE_NAMES } from './notes'

function noteIndex(note: string): number {
  const pitchClass = note.split(/\d/)[0] ?? ''
  return NOTE_NAMES.findIndex(n => n.toLowerCase() === pitchClass.toLowerCase())
}

function getVoiceMotion(from: string, to: string): Voice['motion'] {
  const fromIdx = noteIndex(from)
  const toIdx = noteIndex(to)
  if (fromIdx === -1 && toIdx === -1) return 'leap'
  if (fromIdx === -1 || toIdx === -1) return 'skip'
  const semitones = Math.abs(toIdx - fromIdx)
  if (semitones === 0) return 'common'
  if (semitones === 1) return 'step'
  if (semitones <= 3) return 'skip'
  return 'leap'
}

export function analyzeVoiceLeading(fromChords: Chord[], toChord: Chord): Voice[] {
  const voices: Voice[] = []
  if (!toChord || !fromChords[0]) return []
  const fromNotes = fromChords[0].notes
  const toNotes = toChord.notes
  const maxLen = Math.min(Math.max(fromNotes.length, toNotes.length), 4)
  for (let i = 0; i < maxLen; i++) {
    if (i < fromNotes.length && i < toNotes.length) {
      voices.push({
        fromNote: fromNotes[i] ?? 'C',
        toNote: toNotes[i] ?? 'C',
        motion: getVoiceMotion(fromNotes[i] ?? 'C', toNotes[i] ?? 'C'),
      })
    }
  }
  return voices
}

export function findClosestVoice(chordNotes: string[], targetNote: string): string | null {
  if (chordNotes.length === 0) return null
  const toIdx = noteIndex(targetNote)
  if (toIdx === -1) return chordNotes[0] ?? null
  let closest = chordNotes[0] ?? null
  let minDistance = Infinity
  for (const note of chordNotes) {
    const fromIdx = noteIndex(note)
    if (fromIdx === -1) continue
    const distance = Math.abs(toIdx - fromIdx)
    if (distance < minDistance) {
      minDistance = distance
      closest = note
    }
  }
  return closest
}

export function createSmoothBassLine(chords: Chord[]): string[] {
  return chords.map(chord => chord.root || 'C')
}
