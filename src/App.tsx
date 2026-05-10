import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Layers, Lightbulb, BookOpen, Guitar, Circle, Zap } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import ChordProgressionDisplay from './components/ChordProgressionDisplay'
import SongStructureBuilder from './components/SongStructureBuilder'
import CreativeInspiration from './components/CreativeInspiration'
import TheoryExplorer from './components/TheoryExplorer'
import GuitarLab from './components/GuitarLab'

type Tab = 'song' | 'chords' | 'inspiration' | 'theory' | 'guitar'
type MidiStatus = 'idle' | 'connecting' | 'connected' | 'recording'

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'song',        label: 'Song',        Icon: Music2    },
  { id: 'chords',      label: 'Chord Lab',   Icon: Layers    },
  { id: 'inspiration', label: 'Inspiration', Icon: Lightbulb },
  { id: 'theory',      label: 'Theory',      Icon: BookOpen  },
  { id: 'guitar',      label: 'Guitar Lab',  Icon: Guitar    },
]

const HARMONIC_CONTEXT = [
  { label: 'Key',      value: 'C Major'        },
  { label: 'Scale',    value: 'C D E F G A B'  },
  { label: 'Degree',   value: 'I · V · vi · IV' },
  { label: 'Mode',     value: 'Ionian'          },
  { label: 'Quality',  value: 'Triadic'         },
  { label: 'Relative', value: 'A Minor'         },
  { label: 'Parallel', value: 'C Phrygian'      },
  { label: 'Capo',     value: 'None'            },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('song')
  const [midiStatus] = useState<MidiStatus>('idle')
  const [songMeta, setSongMeta] = useState({ key: 'C', tempo: 120, timeSig: '4/4' })

  return (
    <div className="fixed inset-0 bg-studio-bg text-studio-text flex flex-col overflow-hidden">

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] rounded-full bg-studio-accent/[0.04] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-studio-purple/[0.04] blur-3xl" />
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="relative z-50 h-11 shrink-0 flex items-center px-4 border-b border-studio-border bg-studio-surface/60 backdrop-blur-xl">

        {/* Logo */}
        <div className="flex items-center gap-2 mr-6 select-none">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-studio-accent to-studio-purple flex items-center justify-center shadow-lg shadow-studio-accent/20">
            <Music2 size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight text-studio-text">Soundwave Studio</span>
          <span className="text-[10px] text-studio-muted font-medium bg-studio-surface px-1.5 py-0.5 rounded-md border border-studio-border">
            BETA
          </span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-0.5 h-full">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={twMerge(
                'relative h-full px-4 text-xs font-medium flex items-center gap-2 transition-all duration-150',
                activeTab === id
                  ? 'text-studio-text'
                  : 'text-studio-muted hover:text-studio-text'
              )}
            >
              <Icon size={13} strokeWidth={activeTab === id ? 2.5 : 2} />
              {label}
              {activeTab === id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-studio-accent to-studio-purple rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* MIDI status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-studio-surface border border-studio-border">
          <div className={clsx(
            'w-1.5 h-1.5 rounded-full',
            midiStatus === 'idle'       && 'bg-studio-muted',
            midiStatus === 'connecting' && 'bg-yellow-400 animate-pulse',
            midiStatus === 'connected'  && 'bg-studio-success',
            midiStatus === 'recording'  && 'bg-red-400 animate-pulse',
          )} />
          <span className="text-[10px] text-studio-muted font-medium uppercase tracking-wider">MIDI</span>
          {midiStatus !== 'idle' && (
            <span className={clsx(
              'text-[9px] font-semibold uppercase tracking-wider',
              midiStatus === 'connected'  && 'text-studio-success',
              midiStatus === 'recording'  && 'text-red-400',
              midiStatus === 'connecting' && 'text-yellow-400',
            )}>
              {midiStatus}
            </span>
          )}
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative z-10">

        {/* Left sidebar — song meta */}
        <aside className="hidden md:flex w-44 shrink-0 flex-col border-r border-studio-border bg-studio-surface/30 p-3 gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-studio-muted px-2 py-1">
            Song Info
          </p>

          {[
            { label: 'Key',   value: songMeta.key,              color: 'text-studio-accent' },
            { label: 'Tempo', value: `${songMeta.tempo} BPM`,   color: 'text-studio-purple' },
            { label: 'Time',  value: songMeta.timeSig,          color: 'text-emerald-400'   },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/[0.03] border border-transparent hover:border-studio-border transition-all cursor-pointer group"
            >
              <span className="text-[11px] text-studio-muted group-hover:text-studio-text transition-colors">{label}</span>
              <span className={twMerge('text-[11px] font-mono font-semibold', color)}>{value}</span>
            </div>
          ))}

          <div className="mt-auto border-t border-studio-border/60 pt-3 space-y-1.5">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg border border-studio-border/40 bg-studio-surface/50">
              <Circle size={8} className="text-studio-muted" />
              <span className="text-[10px] text-studio-muted">Ableton</span>
              <span className="ml-auto text-[9px] uppercase tracking-wider text-studio-muted font-semibold">OFF</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {TABS.map(({ id }) =>
              activeTab === id ? (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full min-h-full p-5 max-w-4xl mx-auto"
                >
                  {id === 'song'        && <SongStructureBuilder onMetaChange={setSongMeta} />}
                  {id === 'chords'      && <ChordProgressionDisplay />}
                  {id === 'inspiration' && <CreativeInspiration />}
                  {id === 'theory'      && <TheoryExplorer />}
                  {id === 'guitar'      && <GuitarLab />}
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </main>

        {/* Right sidebar — harmonic context */}
        <aside className="hidden xl:flex w-60 shrink-0 flex-col border-l border-studio-border bg-studio-surface/30 p-3 gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-studio-muted px-2 py-1">
            Harmonic Context
          </p>

          {HARMONIC_CONTEXT.map(({ label, value }) => (
            <div
              key={label}
              className="group flex items-center justify-between px-2.5 py-2 rounded-lg border border-transparent hover:border-studio-border hover:bg-white/[0.02] transition-all cursor-pointer"
            >
              <span className="text-[10px] uppercase tracking-wider text-studio-muted shrink-0 mr-2">{label}</span>
              <span className="text-[11px] font-medium text-studio-text text-right truncate">{value}</span>
            </div>
          ))}

          <div className="mt-auto border-t border-studio-border/60 pt-3">
            <div className="p-2.5 rounded-lg border border-studio-border bg-studio-surface/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-studio-muted">Activity</span>
                <Zap size={10} className="text-studio-muted" />
              </div>
              <div className="h-1 w-full rounded-full bg-studio-bg overflow-hidden">
                <motion.div
                  animate={{ width: ['15%', '40%', '20%', '60%', '25%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-studio-accent to-studio-purple"
                />
              </div>
              <p className="text-[9px] text-studio-muted mt-2 uppercase tracking-wider">Ready</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App

