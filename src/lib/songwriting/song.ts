import type { Song, SongSection } from '@/types'
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
  sectionType: SongSection['type'],
): Song {
  const newSection: SongSection = {
    id: uuidv4(),
    name: sectionName || 'Untitled',
    type: sectionType,
    repeats: 1,
    lyrics: [],
    tempo: song.tempo,
    timeSignature: [song.timeSignature[0], song.timeSignature[1]],
    chords: undefined,
  }
  return {
    ...song,
    sections: [...song.sections, newSection],
    updatedAt: new Date(),
  }
}

export function updateSection(
  song: Song,
  sectionId: string,
  updates: Partial<SongSection>,
): Song {
  return {
    ...song,
    sections: song.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s),
    updatedAt: new Date(),
  }
}

export function removeSection(song: Song, sectionId: string): Song {
  return {
    ...song,
    sections: song.sections.filter(s => s.id !== sectionId),
    updatedAt: new Date(),
  }
}

export function moveSection(song: Song, sectionId: string, direction: 'up' | 'down'): Song {
  const index = song.sections.findIndex(s => s.id === sectionId)
  if (index === -1) return song
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= song.sections.length) return song
  const newSections = [...song.sections]
  const [moved] = newSections.splice(index, 1)
  newSections.splice(newIndex, 0, moved!)
  return { ...song, sections: newSections, updatedAt: new Date() }
}

export function getSongDuration(song: Song): number {
  let totalBeats = 0
  for (const section of song.sections) {
    const estimatedBars = section.lyrics?.length || 4
    const beatsPerMeasure = section.timeSignature?.[0] ?? 4
    totalBeats += estimatedBars * beatsPerMeasure * section.repeats
  }
  return (totalBeats / song.tempo) * 60
}
