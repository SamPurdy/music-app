export interface Voice {
  fromNote: string
  toNote: string
  motion: 'common' | 'step' | 'skip' | 'leap'
}

const NOTE_NAMES = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']

function getVoiceMotion(from: string, to: string): Voice['motion'] {
  const fromRoot = from?.split(/\d/)?.[0]?.replace('#', '').replace('b', '')?.toLowerCase() || 'c'
  const toRoot = to?.split(/\d/)?.[0]?.replace('#', '').replace('b', '')?.toLowerCase() || 'c'
  
  const fromIndex = NOTE_NAMES.findIndex(n => n.toLowerCase() === fromRoot)
  const toIndex = NOTE_NAMES.findIndex(n => n.toLowerCase() === toRoot)
  
  if (fromIndex === -1 && toIndex === -1) return 'leap'
  if (fromIndex === -1 || toIndex === -1) return 'skip'
  
  const semitones = Math.abs(toIndex - fromIndex)
  
  if (semitones === 0) return 'common'
  if (semitones === 1) return 'step'
  if (semitones <= 3) return 'skip'
  return 'leap'
}

export function analyzeVoiceLeading(
  fromChords: any[], 
  toChord: any
): Voice[] {
  const voices: Voice[] = []
  
  if (!toChord || !fromChords?.[0]) return []
  
  const fromNotes = fromChords[0]?.notes || ['c']
  const toNotes = toChord?.notes || ['c']
  
  const maxLen = Math.max(fromNotes.length, toNotes.length) || 1
  
  for (let i = 0; i < maxLen && i < 4; i++) {
    if (i < fromNotes.length && i < toNotes.length) {
      voices.push({
        fromNote: fromNotes[i] ?? 'c',
        toNote: toNotes[i] ?? 'c',
        motion: getVoiceMotion(fromNotes[i], toNotes[i]),
      })
    }
  }
  
  return voices
}

export function findClosestVoice(chordNotes: string[], targetNote: string): string | null {
  let closest = chordNotes[0] || null
  
  for (const note of chordNotes) {
    const fromRoot = note?.split(/\d/)?.[0]?.replace('#', '').replace('b', '')?.toLowerCase() || 'c'
    const toRoot = targetNote?.split(/\d/)?.[0]?.replace('#', '').replace('b', '')?.toLowerCase() || 'c'
    
    const fromIndex = NOTE_NAMES.findIndex(n => n.toLowerCase() === fromRoot)
    const toIndex = NOTE_NAMES.findIndex(n => n.toLowerCase() === toRoot)
    
    if (fromIndex === -1 || toIndex === -1) continue
    
    const distance = Math.abs(toIndex - fromIndex)
    
    if (distance < 3 || closest === null) {
      closest = note || null
    }
  }
  
  return closest
}

export function createSmoothBassLine(chords: { root: string; notes?: string[] }[]): string[] {
  const bassLine: string[] = []
  
  if (!chords?.length) return []
  
  for (let i = 0; i < chords.length; i++) {
    const currentRoot = chords[i]?.root || 'c'
    const bassNote = NOTE_NAMES.findIndex(n => n.toLowerCase() === currentRoot.split(/\d/)?.[0]?.replace('#', '').replace('b', '')?.toLowerCase()) !== -1
      ? NOTE_NAMES[chords.length] : currentRoot
    
    if (!bassLine.length) {
      bassLine.push(currentRoot)
    }
  }
  
  return bassLine
}
