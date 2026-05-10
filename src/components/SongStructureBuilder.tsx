import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Zap, Plus, Trash2, GripVertical } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const SECTION_TYPES = {
  intro:      { label: 'Intro',      color: 'bg-slate-500/15 text-slate-300 border-slate-500/30'   },
  verse:      { label: 'Verse',      color: 'bg-blue-500/15  text-blue-300  border-blue-500/30'    },
  pre_chorus: { label: 'Pre-Ch.',    color: 'bg-cyan-500/15  text-cyan-300  border-cyan-500/30'    },
  chorus:     { label: 'Chorus',     color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  bridge:     { label: 'Bridge',     color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  outro:      { label: 'Outro',      color: 'bg-slate-500/15 text-slate-300 border-slate-500/30'   },
} as const

type SectionType = keyof typeof SECTION_TYPES

interface Section {
  id: number
  name: string
  type: SectionType
  bars: number
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 1, name: 'Intro',    type: 'intro',   bars: 4  },
  { id: 2, name: 'Verse 1',  type: 'verse',   bars: 8  },
  { id: 3, name: 'Chorus',   type: 'chorus',  bars: 8  },
  { id: 4, name: 'Verse 2',  type: 'verse',   bars: 8  },
  { id: 5, name: 'Chorus',   type: 'chorus',  bars: 8  },
  { id: 6, name: 'Bridge',   type: 'bridge',  bars: 8  },
  { id: 7, name: 'Outro',    type: 'outro',   bars: 4  },
]

let nextId = 8

export default function SongStructureBuilder() {
  const [songKey, setSongKey]   = useState('C')
  const [tempo, setTempo]       = useState(120)
  const [timeSig, setTimeSig]   = useState('4/4')
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [title, setTitle]       = useState('Untitled Song')

  const addSection = (type: SectionType) => {
    const meta = SECTION_TYPES[type]
    setSections(prev => [...prev, { id: nextId++, name: meta.label, type, bars: 8 }])
  }

  const removeSection = (id: number) => {
    setSections(prev => prev.filter(s => s.id !== id))
  }

  const totalBars = sections.reduce((acc, s) => acc + s.bars, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="w-full space-y-4">

      {/* Song metadata card */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Music size={15} className="text-emerald-400" />
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-studio-text placeholder-studio-muted focus:outline-none"
            placeholder="Song title…"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="block mb-1 text-[10px] uppercase tracking-widest text-studio-muted">Key</label>
            <input value={songKey} onChange={e => setSongKey(e.target.value.toUpperCase())} maxLength={3} className="w-16 h-8 px-2 text-center text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all" />
          </div>
          <div>
            <label className="block mb-1 text-[10px] uppercase tracking-widest text-studio-muted">BPM</label>
            <input type="number" value={tempo} onChange={e => setTempo(Number(e.target.value) || 120)} className="w-20 h-8 px-2 text-center text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all" />
          </div>
          <div>
            <label className="block mb-1 text-[10px] uppercase tracking-widest text-studio-muted">Time</label>
            <select value={timeSig} onChange={e => setTimeSig(e.target.value)} className="h-8 px-2 text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all appearance-none">
              {['4/4','3/4','6/8','5/4','7/8'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="ml-auto flex items-end">
            <span className="text-[11px] text-studio-muted font-mono">{totalBars} bars total</span>
          </div>
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-2 max-h-[calc(100vh-460px)] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {sections.map((section, index) => {
            const meta = SECTION_TYPES[section.type]
            return (
              <motion.div key={section.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }} className="group flex items-center gap-3 p-3 rounded-xl border border-studio-border bg-studio-surface hover:border-studio-border/80 hover:-translate-y-px transition-all">
                <GripVertical size={14} className="text-studio-muted/30 group-hover:text-studio-muted/60 cursor-grab shrink-0" />
                <span className={twMerge('text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border shrink-0', meta.color)}>{meta.label}</span>
                <input
                  value={section.name}
                  onChange={e => setSections(prev => prev.map(s => s.id === section.id ? { ...s, name: e.target.value } : s))}
                  className="flex-1 bg-transparent text-sm font-medium text-studio-text focus:outline-none min-w-0"
                />
                <div className="flex items-center gap-1 text-[10px] text-studio-muted font-mono shrink-0">
                  <input type="number" min={1} max={64} value={section.bars} onChange={e => setSections(prev => prev.map(s => s.id === section.id ? { ...s, bars: Number(e.target.value) || 4 } : s))} className="w-10 text-center bg-studio-bg border border-studio-border rounded px-1 py-0.5 text-[10px] font-mono text-studio-muted focus:outline-none focus:border-emerald-500/60" />
                  <span>bars</span>
                </div>
                <button onClick={() => removeSection(section.id)} className="p-1 rounded text-studio-muted/30 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={12} /></button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Add section row */}
      <div className="border-t border-studio-border/50 pt-3 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-studio-muted">Add section</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SECTION_TYPES) as SectionType[]).map(type => (
            <button key={type} onClick={() => addSection(type)} className={twMerge('flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all hover:-translate-y-px', SECTION_TYPES[type].color)}>
              <Plus size={10} /> {SECTION_TYPES[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 pt-1">
        <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-600/20">
          <Zap size={13} /> Export MIDI
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-studio-border bg-studio-surface hover:bg-studio-bg text-studio-muted hover:text-studio-text text-xs font-semibold transition-colors">
          Save
        </button>
      </div>
    </motion.div>
  )
}
