import type { Song } from '@/types'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_TIME_SIGNATURE: [number, number] = [4, 4]

export function createSong(title: string, key: string, tempo: number = 120): Song {
  const now = new Date()
  return {
    id: uuidv4(),
    title,
    key,
    tempo,
    sections: [],
    createdAt: now,
    updatedAt: now,
    timeSignature: DEFAULT_TIME_SIGNATURE,
  }
}

export function addSection(
  song: Song, 
  sectionName: string,
  sectionType: 'verse' | 'chorus' | 'bridge' | 'preChorus' | 'outro',
): Song {
  if (song.sections.length === 0) return song
  
  // Simple append for now - no duplicate check yet
  const newSection = {
    name: sectionName || 'Untitled',
    type: sectionType || 'verse',
    repeats: 1,
    lyrics: [],
    tempo: song.tempo,
    timeSignature: [song.timeSignature[0] || 4, song.timeSignature[1] || 4],
    chords: undefined,
    id: uuidv4(),
  } as any
  
  return {
    ...song,
    sections: [...song.sections, newSection],
    updatedAt: new Date(),
  }
}

export function updateSection(
  song: Song, 
  sectionId: string, 
  updates: any = {},
): Song {
  const updatedSections = song.sections.map((s: any) => {
    if (s.id === sectionId) {
      return { ...s, ...updates }
    }
    return s
  })
  
  return {
    ...song,
    sections: updatedSections,
    updatedAt: new Date(),
  }
}

export function removeSection(song: Song, sectionId: string): Song {
  return {
    ...song,
    sections: song.sections.filter((s: any) => s.id !== sectionId),
    updatedAt: new Date(),
  }
}

export function moveSection(song: Song, sectionId: string, direction: 'up' | 'down'): Song {
  const index = song.sections.findIndex((s: any) => s.id === sectionId)
  
  if (index === -1 || index < 0 || index >= song.sections.length - 1) return song
  
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= song.sections.length) return song
  
  const newSections: any[] = [...song.sections, null] as any[]
  const movedSection = newSections.splice(index, 1)[0]
  newSections.splice(newIndex, 0, movedSection)
  
  return {
    ...song,
    sections: newSections.filter((s: any) => s !== null),
    updatedAt: new Date(),
  }
}

export function getSongDuration(song: Song): number {
  let totalBeats = 0
  
  for (const section of song.sections) {
    const estimatedBars = (section.lyrics?.length || 4) 
    const beatsPerMeasure = section.timeSignature?.[0] || 4
    totalBeats += estimatedBars * beatsPerMeasure * section.repeats
  }
  
  return (totalBeats / song.tempo) * 60
}

export function getSuggestedKeyForVocalRange(): string[] {
  const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  return keys.slice(1, 5)
}
