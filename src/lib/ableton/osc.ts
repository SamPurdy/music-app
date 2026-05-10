import type { Chord, SongSection } from '@/types'

interface OSCMessage {
  address: string
  args: Array<{ type: string; value: string | number }>
}

interface OSCClient {
  host: string
  port: number
  connected: boolean
}

let client: OSCClient | null = null

export function initOSC(host: string = '127.0.0.1', port: number = 8000): void {
  client = { host, port, connected: false }
}

export function sendChordToAbleton(chord: Chord, trackIndex: number = 0): boolean {
  if (!client) {
    console.warn('OSC not initialized')
    return false
  }
  const message: OSCMessage = {
    address: `/music/chord/${trackIndex}`,
    args: [
      { type: 'str', value: chord.full },
      { type: 'str', value: chord.root },
      { type: 'str', value: chord.quality },
      { type: 'i', value: chord.notes.length },
    ],
  }
  console.log('OSC send:', message)
  return true
}

export function sendSectionData(section: SongSection, trackIndex: number = 0): boolean {
  if (!client) {
    console.warn('OSC not initialized')
    return false
  }
  const message: OSCMessage = {
    address: `/music/section/${trackIndex}`,
    args: [
      { type: 'str', value: section.name },
      { type: 'str', value: section.type },
      { type: 'i', value: section.tempo },
      { type: 'i', value: section.repeats },
    ],
  }
  console.log('OSC send:', message)
  return true
}

export function sendTransportState(beat: number, bar: number, isPlaying: boolean): boolean {
  if (!client) {
    console.warn('OSC not initialized')
    return false
  }
  const message: OSCMessage = {
    address: '/music/transport',
    args: [
      { type: 'f', value: beat },
      { type: 'i', value: bar },
      { type: 'i', value: isPlaying ? 1 : 0 },
    ],
  }
  console.log('OSC send:', message)
  return true
}

export function connectOSC(port?: number): boolean {
  if (!client) return false
  if (port !== undefined) client.port = port
  client.connected = true
  console.log(`OSC connected to ${client.host}:${client.port}`)
  return true
}

export function disconnectOSC(): void {
  if (client) {
    client.connected = false
    client = null
  }
}
