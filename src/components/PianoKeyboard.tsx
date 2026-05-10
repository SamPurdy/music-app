import { twMerge } from 'tailwind-merge'
import { playPianoNote } from '@/lib/audio/synth'

interface PianoKeyboardProps {
  /** Note indices (0-11) in the scale, NOT including the root */
  scaleNotes?: number[]
  /** Single note index (0-11) for the root */
  rootNote?: number
  onNoteClick?: (noteIndex: number) => void
  label?: string
}

const WHITE_INDICES = [0, 2, 4, 5, 7, 9, 11]
const NOTE_NAMES_12 = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const BLACK_NOTE_INDICES = [1, 3, 6, 8, 10]

const WHITE_W = 52
const WHITE_H = 165
const BLACK_W = 33
const BLACK_H = 104
const OCTAVE_W = WHITE_W * 7

// Black key x positions for WHITE_W=52
const BLACK_X_OFFSETS = [35, 87, 191, 243, 295]

type KeyState = 'root' | 'scale' | 'none'

function getState(noteIdx: number, rootNote: number | undefined, scaleSet: Set<number>): KeyState {
  if (rootNote !== undefined && rootNote === noteIdx) return 'root'
  if (scaleSet.has(noteIdx)) return 'scale'
  return 'none'
}

function whiteKeyClass(state: KeyState): string {
  if (state === 'root')  return 'bg-sky-400 border-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.5)]'
  if (state === 'scale') return 'bg-violet-300/50 border-violet-400'
  return 'bg-white border-gray-300 hover:bg-gray-50'
}

function blackKeyClass(state: KeyState): string {
  if (state === 'root')  return 'bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
  if (state === 'scale') return 'bg-violet-500'
  return 'bg-gray-600 hover:bg-gray-500'
}

function whiteTextClass(state: KeyState): string {
  if (state === 'root')  return 'text-slate-900 font-bold'
  if (state === 'scale') return 'text-violet-800 font-semibold'
  return 'text-gray-400'
}

function blackTextClass(state: KeyState): string {
  if (state === 'root')  return 'text-slate-900 font-bold'
  if (state === 'scale') return 'text-white font-semibold'
  return 'text-gray-300'
}

export default function PianoKeyboard({ scaleNotes = [], rootNote, onNoteClick, label }: PianoKeyboardProps) {
  const scaleSet = new Set(scaleNotes)
  const totalWidth = 15 * WHITE_W

  const keys: React.ReactNode[] = []

  for (let oct = 0; oct < 2; oct++) {
    for (let wi = 0; wi < 7; wi++) {
      const noteIdx = WHITE_INDICES[wi]
      const x = (oct * 7 + wi) * WHITE_W
      const octaveLabel = oct === 0 ? 4 : 5
      const state = getState(noteIdx, rootNote, scaleSet)
      keys.push(
        <div
          key={`w-${oct}-${wi}`}
          onClick={() => { playPianoNote(noteIdx, octaveLabel).catch(() => {}); onNoteClick?.(noteIdx) }}
          style={{ left: x, width: WHITE_W, height: WHITE_H, top: 0 }}
          className={twMerge(
            'absolute border rounded-b-md flex flex-col justify-end items-center pb-2 cursor-pointer transition-colors select-none',
            whiteKeyClass(state)
          )}
        >
          <span className={twMerge('font-mono text-[11px] leading-none', whiteTextClass(state))}>
            {noteIdx === 0 ? `C${octaveLabel}` : NOTE_NAMES_12[noteIdx]}
          </span>
        </div>
      )
    }

    for (let bi = 0; bi < 5; bi++) {
      const noteIdx = BLACK_NOTE_INDICES[bi]
      const x = oct * OCTAVE_W + BLACK_X_OFFSETS[bi]
      const state = getState(noteIdx, rootNote, scaleSet)
      keys.push(
        <div
          key={`b-${oct}-${bi}`}
          onClick={() => { playPianoNote(noteIdx, oct === 0 ? 4 : 5).catch(() => {}); onNoteClick?.(noteIdx) }}
          style={{ left: x, width: BLACK_W, height: BLACK_H, top: 0, zIndex: 10 }}
          className={twMerge(
            'absolute rounded-b-md flex flex-col justify-end items-center pb-1.5 cursor-pointer transition-colors select-none',
            blackKeyClass(state)
          )}
        >
          <span className={twMerge('font-mono text-[9px] leading-none', blackTextClass(state))}>
            {NOTE_NAMES_12[noteIdx]}
          </span>
        </div>
      )
    }
  }

  // Final C6
  const c6State = getState(0, rootNote, scaleSet)
  keys.push(
    <div
      key="w-c6"
      onClick={() => { playPianoNote(0, 6).catch(() => {}); onNoteClick?.(0) }}
      style={{ left: 14 * WHITE_W, width: WHITE_W, height: WHITE_H, top: 0 }}
      className={twMerge(
        'absolute border rounded-b-md flex flex-col justify-end items-center pb-2 cursor-pointer transition-colors select-none',
        whiteKeyClass(c6State)
      )}
    >
      <span className={twMerge('font-mono text-[11px] leading-none', whiteTextClass(c6State))}>
        C6
      </span>
    </div>
  )

  return (
    <div className="space-y-2">
      {label && <p className="text-xs text-studio-muted">{label}</p>}
      <div className="overflow-x-auto">
        <div style={{ position: 'relative', width: totalWidth, height: WHITE_H }}>
          {keys}
        </div>
      </div>
    </div>
  )
}
