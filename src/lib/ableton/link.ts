export interface LinkSyncState {
  enabled: boolean
  tempo: number
  startTime: number
  currentTime: number
  beat: number
  bar: number
  phase: number
}

interface LinkState {
  isRunning: boolean
  tempo: number
  startTime: number
  currentTime: number
  beatsPerBar: number
}

let linkState: LinkState | null = null
let listeners: Set<() => void> = new Set()

export function initAbletonLink(): boolean {
  try {
    const AbletonLink = (globalThis as any).AbletonLink
    if (!AbletonLink) {
      console.warn('AbletonLink not available in this environment')
      return false
    }
    return true
  } catch {
    console.warn('AbletonLink not available')
    return false
  }
}

export function startLink(tempo: number = 120, beatsPerBar: number = 4): LinkSyncState {
  linkState = {
    isRunning: true,
    tempo,
    startTime: performance.now(),
    currentTime: 0,
    beatsPerBar,
  }
  
  return {
    enabled: true,
    tempo,
    startTime: linkState.startTime,
    currentTime: 0,
    beat: 0,
    bar: 0,
    phase: 0,
  }
}

export function stopLink(): void {
  linkState = null
  listeners.clear()
}

export function getLinkState(): LinkSyncState | null {
  if (!linkState) return null
  
  const elapsed = (performance.now() - linkState.startTime) / 1000
  const beatsElapsed = elapsed * (linkState.tempo / 60)
  const beat = Math.floor(beatsElapsed) % linkState.beatsPerBar
  const bar = Math.floor(beatsElapsed / linkState.beatsPerBar)
  const phase = (beatsElapsed % 1)
  
  return {
    enabled: true,
    tempo: linkState.tempo,
    startTime: linkState.startTime,
    currentTime: elapsed,
    beat,
    bar,
    phase,
  }
}

export function setTempo(tempo: number): void {
  if (linkState) {
    const oldBeats = linkState.currentTime * (linkState.tempo / 60)
    linkState.tempo = tempo
    linkState.startTime = performance.now() - (oldBeats / (linkState.tempo / 60))
    notifyListeners()
  }
}

export function onLinkChange(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener()
  }
}

export function beatsToTime(beats: number, tempo: number = 120): number {
  return (beats / tempo) * 60
}

export function timeToBeats(seconds: number, tempo: number = 120): number {
  return (seconds * tempo) / 60
}

export function getBarPosition(beats: number, beatsPerBar: number = 4): { bar: number; beat: number; phase: number } {
  const bar = Math.floor(beats / beatsPerBar)
  const beat = Math.floor(beats) % beatsPerBar
  const phase = beats - Math.floor(beats)
  return { bar, beat, phase }
}
