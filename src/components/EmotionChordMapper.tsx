import { useState, useCallback } from 'react'
import * as Tonal from 'tonal'
import { twMerge } from 'tailwind-merge'
import { motion, AnimatePresence } from 'framer-motion'
import { playPianoChord, playGuitarChord, chordNotesToNoteNames } from '@/lib/audio/synth'

// ── Data ──────────────────────────────────────────────────────

interface EmotionEntry {
  label: string
  emoji: string
  color: string          // Tailwind bg/text class pair  (accent ring)
  textColor: string
  bgClass: string
  key: string            // Suggested key (root note)
  scale: 'major' | 'minor'
  pattern: string[]      // Roman numeral degrees (0-based indices into QUALITIES arrays)
  theoryNote: string     // Short explanation
  genres: string[]
  qualities: Array<'major' | 'minor' | 'diminished'>
  romans: string[]
}

type Instrument = 'piano' | 'guitar'

const EMOTIONS: EmotionEntry[] = [
  {
    label: 'Joy',
    emoji: '☀️',
    color: 'ring-yellow-400/50',
    textColor: 'text-yellow-300',
    bgClass: 'bg-yellow-400/10 border-yellow-400/30',
    key: 'C',
    scale: 'major',
    pattern: ['I', 'IV', 'V', 'I'],
    qualities: ['major', 'major', 'major', 'major'],
    romans: ['I', 'IV', 'V', 'I'],
    theoryNote: 'Bright major triads with a strong tonic–dominant pull create an uplifting, resolved feel.',
    genres: ['Pop', 'Folk', 'Gospel'],
  },
  {
    label: 'Melancholy',
    emoji: '🌧️',
    color: 'ring-blue-400/50',
    textColor: 'text-blue-300',
    bgClass: 'bg-blue-400/10 border-blue-400/30',
    key: 'A',
    scale: 'minor',
    pattern: ['i', '♭VI', '♭III', '♭VII'],
    qualities: ['minor', 'major', 'major', 'major'],
    romans: ['i', '♭VI', '♭III', '♭VII'],
    theoryNote: "The natural minor scale's ♭VI and ♭VII chords give a wistful, unresolved ache without being dark.",
    genres: ['Singer-songwriter', 'Indie', 'Alt-rock'],
  },
  {
    label: 'Tension',
    emoji: '⚡',
    color: 'ring-red-500/50',
    textColor: 'text-red-300',
    bgClass: 'bg-red-500/10 border-red-500/30',
    key: 'D',
    scale: 'minor',
    pattern: ['i', 'ii°', 'V', 'i'],
    qualities: ['minor', 'diminished', 'major', 'minor'],
    romans: ['i', 'ii°', 'V', 'i'],
    theoryNote: 'The diminished ii° creates instability; the major V (borrowed dominant) heightens urgency before resolving.',
    genres: ['Thriller', 'Metal', 'Dramatic film scores'],
  },
  {
    label: 'Wonder',
    emoji: '✨',
    color: 'ring-violet-400/50',
    textColor: 'text-violet-300',
    bgClass: 'bg-violet-400/10 border-violet-400/30',
    key: 'E',
    scale: 'major',
    pattern: ['I', 'iii', 'vi', 'IV'],
    qualities: ['major', 'minor', 'minor', 'major'],
    romans: ['I', 'iii', 'vi', 'IV'],
    theoryNote: 'The iii chord (mediant) adds an ethereal quality; moving to vi floats you away from the tonic center.',
    genres: ['Cinematic', 'Fantasy game OST', 'Ambient pop'],
  },
  {
    label: 'Longing',
    emoji: '🌙',
    color: 'ring-indigo-400/50',
    textColor: 'text-indigo-300',
    bgClass: 'bg-indigo-400/10 border-indigo-400/30',
    key: 'F#',
    scale: 'minor',
    pattern: ['i', 'v', '♭VI', '♭VII'],
    qualities: ['minor', 'minor', 'major', 'major'],
    romans: ['i', 'v', '♭VI', '♭VII'],
    theoryNote: 'Using a natural minor v (instead of major V) removes the leading tone, leaving a yearning that never quite resolves.',
    genres: ['Indie folk', 'Dream pop', 'Ballad'],
  },
  {
    label: 'Anger',
    emoji: '🔥',
    color: 'ring-orange-500/50',
    textColor: 'text-orange-300',
    bgClass: 'bg-orange-500/10 border-orange-500/30',
    key: 'E',
    scale: 'minor',
    pattern: ['i', '♭VII', '♭VI', '♭VII'],
    qualities: ['minor', 'major', 'major', 'major'],
    romans: ['i', '♭VII', '♭VI', '♭VII'],
    theoryNote: 'Dorian/Aeolian ♭VII–♭VI riff is the backbone of hard rock power — forward momentum, no clean resolution.',
    genres: ['Hard rock', 'Metal', 'Punk'],
  },
  {
    label: 'Serenity',
    emoji: '🌿',
    color: 'ring-emerald-400/50',
    textColor: 'text-emerald-300',
    bgClass: 'bg-emerald-400/10 border-emerald-400/30',
    key: 'G',
    scale: 'major',
    pattern: ['I', 'V', 'vi', 'iii'],
    qualities: ['major', 'major', 'minor', 'minor'],
    romans: ['I', 'V', 'vi', 'iii'],
    theoryNote: 'Descending bass line I→V→vi→iii (each chord shares two notes with the last) creates smooth, calm voice leading.',
    genres: ['Ambient', 'New age', 'Acoustic'],
  },
  {
    label: 'Nostalgia',
    emoji: '📷',
    color: 'ring-rose-400/50',
    textColor: 'text-rose-300',
    bgClass: 'bg-rose-400/10 border-rose-400/30',
    key: 'C',
    scale: 'major',
    pattern: ['I', 'V', 'vi', 'IV'],
    qualities: ['major', 'major', 'minor', 'major'],
    romans: ['I', 'V', 'vi', 'IV'],
    theoryNote: 'The "axis" or "pop-punk" progression — globally familiar harmonic loop that triggers a sense of pleasant recognition.',
    genres: ['Pop', 'Classic rock', 'Country'],
  },
  {
    label: 'Suspense',
    emoji: '🕯️',
    color: 'ring-slate-400/50',
    textColor: 'text-slate-300',
    bgClass: 'bg-slate-400/10 border-slate-400/30',
    key: 'B',
    scale: 'minor',
    pattern: ['i', 'ii°', '♭VII', 'V'],
    qualities: ['minor', 'diminished', 'major', 'major'],
    romans: ['i', 'ii°', '♭VII', 'V'],
    theoryNote: 'Sparse movement with an unresolved major V at the end keeps the listener waiting; perfect for cliffhangers.',
    genres: ['Horror', 'Thriller', 'Detective'],
  },
  {
    label: 'Euphoria',
    emoji: '🎉',
    color: 'ring-pink-400/50',
    textColor: 'text-pink-300',
    bgClass: 'bg-pink-400/10 border-pink-400/30',
    key: 'Ab',
    scale: 'major',
    pattern: ['I', 'IV', 'vi', 'V'],
    qualities: ['major', 'major', 'minor', 'major'],
    romans: ['I', 'IV', 'vi', 'V'],
    theoryNote: 'High-energy major with a flat-six drop provides a sudden lift — the "festival EDM" feeling of release.',
    genres: ['EDM', 'Dance pop', 'Anthem'],
  },
]

// Build octave-aware note names for a given chord type and root
function buildPlayableChord(rootNote: string, quality: 'major' | 'minor' | 'diminished', instrument: Instrument): string[] {
  const suffix = quality === 'minor' ? 'm' : quality === 'diminished' ? 'dim' : ''
  const chord = Tonal.Chord.get(`${rootNote}${suffix}`)
  const notes = chord.notes.length > 0 ? chord.notes : [rootNote]
  return chordNotesToNoteNames(notes, instrument)
}

// Get the actual root note for a given scale degree within a key
function degreeToRoot(degree: number, key: string, scale: 'major' | 'minor'): string {
  const scaleData = Tonal.Scale.get(`${key} ${scale}`)
  const notes = scaleData.notes.length > 0 ? scaleData.notes : ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  return notes[degree] ?? key
}

// Map roman numeral string to scale degree index
const ROMAN_TO_DEGREE: Record<string, number> = {
  'I': 0, 'i': 0,
  'ii': 1, 'ii°': 1,
  'III': 2, '♭III': 2, 'iii': 2,
  'IV': 3, 'iv': 3,
  'V': 4, 'v': 4,
  'VI': 5, '♭VI': 5, 'vi': 5,
  'VII': 6, '♭VII': 6, 'vii°': 6,
}

// ── Component ─────────────────────────────────────────────────

export default function EmotionChordMapper() {
  const [selected, setSelected] = useState<EmotionEntry>(EMOTIONS[0])
  const [instrument, setInstrument] = useState<Instrument>('piano')
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [playingAll, setPlayingAll] = useState(false)

  const chordPillData = selected.romans.map((roman, i) => {
    const degree = ROMAN_TO_DEGREE[roman] ?? i
    const root = degreeToRoot(degree, selected.key, selected.scale)
    const quality = selected.qualities[i]
    return { roman, root, quality, notes: buildPlayableChord(root, quality, instrument) }
  })

  const playSingleChord = useCallback((notes: string[], idx: number) => {
    setPlayingIdx(idx)
    const fn = instrument === 'piano' ? playPianoChord : playGuitarChord
    fn(notes).catch(() => {})
    setTimeout(() => setPlayingIdx(null), 1200)
  }, [instrument])

  const playAll = useCallback(async () => {
    if (playingAll) return
    setPlayingAll(true)
    for (let i = 0; i < chordPillData.length; i++) {
      setPlayingIdx(i)
      const fn = instrument === 'piano' ? playPianoChord : playGuitarChord
      fn(chordPillData[i].notes).catch(() => {})
      await new Promise<void>(r => setTimeout(r, 1400))
    }
    setPlayingIdx(null)
    setPlayingAll(false)
  }, [chordPillData, instrument, playingAll])

  const qualitySuffix = (q: 'major' | 'minor' | 'diminished') => {
    if (q === 'minor') return 'm'
    if (q === 'diminished') return '°'
    return ''
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-studio-text">Emotion → Chord Mapper</h3>
        <p className="text-xs text-studio-muted mt-0.5">
          Choose a mood and instantly get the chords, theory, and a playable progression
        </p>
      </div>

      {/* Emotion grid */}
      <div className="grid grid-cols-5 gap-2">
        {EMOTIONS.map(emotion => (
          <button
            key={emotion.label}
            onClick={() => setSelected(emotion)}
            className={twMerge(
              'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-center',
              selected.label === emotion.label
                ? `${emotion.bgClass} ring-1 ${emotion.color} scale-[1.04]`
                : 'border-studio-border bg-studio-surface hover:bg-white/[0.03] hover:border-studio-border/80 hover:scale-[1.02]'
            )}
          >
            <span className="text-xl leading-none">{emotion.emoji}</span>
            <span className={twMerge(
              'text-[10px] font-semibold leading-none',
              selected.label === emotion.label ? emotion.textColor : 'text-studio-muted'
            )}>
              {emotion.label}
            </span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-2xl border border-studio-border bg-studio-surface p-5 space-y-5"
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <h4 className={twMerge('text-base font-bold', selected.textColor)}>{selected.label}</h4>
                <p className="text-[11px] text-studio-muted mt-0.5">
                  Suggested key: <span className="text-studio-text font-semibold">{selected.key} {selected.scale}</span>
                  &nbsp;·&nbsp;{selected.genres.join(', ')}
                </p>
              </div>
            </div>

            {/* Instrument toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-studio-border p-0.5 bg-studio-bg shrink-0">
              {(['piano', 'guitar'] as Instrument[]).map(inst => (
                <button
                  key={inst}
                  onClick={() => setInstrument(inst)}
                  className={twMerge(
                    'px-3 py-1 rounded-md text-xs font-medium capitalize transition-all',
                    instrument === inst
                      ? 'bg-studio-accent text-white shadow-sm'
                      : 'text-studio-muted hover:text-studio-text'
                  )}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          {/* Theory note */}
          <div className={twMerge('rounded-xl p-3 border text-xs leading-relaxed', selected.bgClass, selected.textColor)}>
            <span className="font-semibold opacity-70 uppercase tracking-widest text-[9px] block mb-1">Music Theory</span>
            {selected.theoryNote}
          </div>

          {/* Chord pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-widest text-studio-muted">Progression</p>
              <button
                onClick={playAll}
                disabled={playingAll}
                className={twMerge(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  playingAll
                    ? 'border-studio-border text-studio-muted cursor-not-allowed'
                    : 'border-studio-accent/40 bg-studio-accent/10 text-studio-accent hover:bg-studio-accent/20'
                )}
              >
                <span>{playingAll ? '▶ Playing…' : '▶ Play All'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {chordPillData.map(({ roman, root, quality, notes }, i) => (
                <motion.button
                  key={i}
                  onClick={() => playSingleChord(notes, i)}
                  animate={playingIdx === i ? { scale: [1, 1.06, 1] } : {}}
                  transition={{ duration: 0.25 }}
                  className={twMerge(
                    'flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border cursor-pointer transition-all hover:scale-105 active:scale-95',
                    playingIdx === i
                      ? `${selected.bgClass} ring-1 ${selected.color}`
                      : 'border-studio-border bg-studio-surface/50 hover:bg-white/[0.04]'
                  )}
                >
                  <span className="text-[10px] text-studio-muted font-medium">{roman}</span>
                  <span className={twMerge('text-lg font-bold leading-tight', playingIdx === i ? selected.textColor : 'text-studio-text')}>
                    {root}{qualitySuffix(quality)}
                  </span>
                  <span className="text-[9px] text-studio-muted capitalize">{quality}</span>
                </motion.button>
              ))}
            </div>
            <p className="text-[10px] text-studio-muted">Click any chord to preview · Play All plays them sequentially</p>
          </div>

          {/* Voice leading hint */}
          <div className="rounded-xl bg-studio-bg/60 border border-studio-border p-3 space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-studio-muted">Voice Leading Sketch</p>
            <div className="flex items-center gap-2 flex-wrap">
              {chordPillData.map(({ root, quality }, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={twMerge(
                    'text-xs font-semibold px-2 py-0.5 rounded-md border',
                    selected.bgClass, selected.textColor
                  )}>
                    {root}{qualitySuffix(quality)}
                  </span>
                  {i < chordPillData.length - 1 && (
                    <span className="text-studio-muted text-[10px]">→</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-studio-muted leading-relaxed">
              Suggested tempo: <span className="text-studio-text">{selected.scale === 'minor' ? '60–90 BPM' : '90–130 BPM'}</span>
              &nbsp;·&nbsp;Try a slow strum or arpeggiated pattern on {instrument}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
