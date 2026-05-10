import { twMerge } from 'tailwind-merge'
import { playPianoNote } from '@/lib/audio/synth'

interface PianoKeyboardProps {
  highlightedNotes?: number[]
  rootNote?: number
  onNoteClick?: (noteIndex: number) => void
  label?: string
}

const WHITE_INDICES = [0, 2, 4, 5, 7, 9, 11]   // C D E F G A B
const NOTE_NAMES_12 = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

const WHITE_W = 34
const WHITE_H = 110
const BLACK_W = 22
const BLACK_H = 68
const OCTAVE_W = WHITE_W * 7  // 238

// Black key x offsets within one octave (5 black keys)
const BLACK_X_OFFSETS = [23, 57, 125, 159, 193]
const BLACK_NOTE_INDICES = [1, 3, 6, 8, 10]  // C# D# F# G# A#

export default function PianoKeyboard({ highlightedNotes = [], rootNote, onNoteClick, label }: PianoKeyboardProps) {
  const totalWhiteKeys = 15  // 7+7+1 (C4 through C6)
  const totalWidth = totalWhiteKeys * WHITE_W

  const keys: React.ReactNode[] = []

  for (let oct = 0; oct < 2; oct++) {
    // White keys
    for (let wi = 0; wi < 7; wi++) {
      const noteIdx = WHITE_INDICES[wi]
      const x = (oct * 7 + wi) * WHITE_W
      const isHighlighted = highlightedNotes.includes(noteIdx)
      const isRoot = rootNote === noteIdx
      const isC = noteIdx === 0
      const octaveLabel = oct === 0 ? 4 : 5

      keys.push(
        <div
          key={`w-${oct}-${wi}`}
          onClick={() => {
            playPianoNote(noteIdx, oct === 0 ? 4 : 5).catch(() => {})
            onNoteClick?.(noteIdx)
          }}
          style={{ left: x, width: WHITE_W, height: WHITE_H, top: 0 }}
          className={twMerge(
            'absolute border border-studio-border rounded-b-md flex flex-col justify-end items-center pb-1 cursor-pointer transition-colors select-none',
            isRoot
              ? 'bg-studio-accent shadow-[0_0_12px_rgba(56,189,248,0.5)]'
              : isHighlighted
              ? 'bg-studio-accent/30 border-studio-accent/60'
              : 'bg-white hover:bg-gray-100'
          )}
        >
          <span className={twMerge(
            'font-mono leading-none',
            isC ? 'text-[8px]' : 'text-[7px]',
            isRoot ? 'text-studio-bg font-bold' : isHighlighted ? 'text-studio-accent font-semibold' : 'text-gray-400'
          )}>
            {isC ? `C${octaveLabel}` : NOTE_NAMES_12[noteIdx]}
          </span>
        </div>
      )
    }

    // Black keys
    for (let bi = 0; bi < 5; bi++) {
      const noteIdx = BLACK_NOTE_INDICES[bi]
      const x = oct * OCTAVE_W + BLACK_X_OFFSETS[bi]
      const isHighlighted = highlightedNotes.includes(noteIdx)
      const isRoot = rootNote === noteIdx

      keys.push(
        <div
          key={`b-${oct}-${bi}`}
          onClick={() => {
            playPianoNote(noteIdx, oct === 0 ? 4 : 5).catch(() => {})
            onNoteClick?.(noteIdx)
          }}
          style={{ left: x, width: BLACK_W, height: BLACK_H, top: 0, zIndex: 10 }}
          className={twMerge(
            'absolute rounded-b-md flex flex-col justify-end items-center pb-1 cursor-pointer transition-colors select-none',
            isRoot
              ? 'bg-studio-accent shadow-[0_0_10px_rgba(56,189,248,0.6)]'
              : isHighlighted
              ? 'bg-studio-accent/70'
              : 'bg-[#1e1e2e] hover:bg-[#2a2a3e]'
          )}
        >
          <span className={twMerge(
            'font-mono text-[6px] leading-none',
            isRoot ? 'text-studio-bg' : isHighlighted ? 'text-white' : 'text-gray-600'
          )}>
            {NOTE_NAMES_12[noteIdx]}
          </span>
        </div>
      )
    }
  }

  // Final C6
  const c6X = 14 * WHITE_W
  keys.push(
    <div
      key="w-c6"
      onClick={() => {
        playPianoNote(0, 6).catch(() => {})
        onNoteClick?.(0)
      }}
      style={{ left: c6X, width: WHITE_W, height: WHITE_H, top: 0 }}
      className={twMerge(
        'absolute border border-studio-border rounded-b-md flex flex-col justify-end items-center pb-1 cursor-pointer transition-colors select-none',
        rootNote === 0
          ? 'bg-studio-accent shadow-[0_0_12px_rgba(56,189,248,0.5)]'
          : highlightedNotes.includes(0)
          ? 'bg-studio-accent/30 border-studio-accent/60'
          : 'bg-white hover:bg-gray-100'
      )}
    >
      <span className={twMerge(
        'font-mono text-[8px] leading-none',
        rootNote === 0 ? 'text-studio-bg font-bold' : highlightedNotes.includes(0) ? 'text-studio-accent font-semibold' : 'text-gray-400'
      )}>
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
