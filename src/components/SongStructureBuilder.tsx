import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Save, Upload } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

const SECTION_TYPES = {
  intro:        { label: 'Intro',    color: 'bg-slate-500/15 text-slate-300 border-slate-500/30'      },
  verse:        { label: 'Verse',    color: 'bg-blue-500/15  text-blue-300  border-blue-500/30'       },
  'pre-chorus': { label: 'Pre-Ch.',  color: 'bg-cyan-500/15  text-cyan-300  border-cyan-500/30'       },
  chorus:       { label: 'Chorus',   color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  bridge:       { label: 'Bridge',   color: 'bg-purple-500/15 text-purple-300 border-purple-500/30'   },
  outro:        { label: 'Outro',    color: 'bg-slate-500/15 text-slate-300 border-slate-500/30'      },
} as const

type SectionType = keyof typeof SECTION_TYPES

interface Section {
  id: number
  name: string
  type: SectionType
  bars: number
  chords: string
  lyrics: string
}

const KEYS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

const NOTE_NAMES_FULL = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT_TO_SHARP: Record<string,string> = { Db:'C#',Eb:'D#',Fb:'E',Gb:'F#',Ab:'G#',Bb:'A#',Cb:'B' }

function transposeChordName(chord: string, semitones: number): string {
  if (!chord.trim()) return chord
  const rootMatch = chord.match(/^([A-G][#b]?)(.*)$/)
  if (!rootMatch) return chord
  const root = FLAT_TO_SHARP[rootMatch[1]] ?? rootMatch[1]
  const suffix = rootMatch[2]
  const idx = NOTE_NAMES_FULL.indexOf(root)
  if (idx === -1) return chord
  const newIdx = ((idx + semitones) % 12 + 12) % 12
  return NOTE_NAMES_FULL[newIdx] + suffix
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 1, name: 'Intro',   type: 'intro',   bars: 4,  chords: '', lyrics: '' },
  { id: 2, name: 'Verse 1', type: 'verse',   bars: 8,  chords: '', lyrics: '' },
  { id: 3, name: 'Chorus',  type: 'chorus',  bars: 8,  chords: '', lyrics: '' },
  { id: 4, name: 'Verse 2', type: 'verse',   bars: 8,  chords: '', lyrics: '' },
  { id: 5, name: 'Chorus',  type: 'chorus',  bars: 8,  chords: '', lyrics: '' },
  { id: 6, name: 'Bridge',  type: 'bridge',  bars: 8,  chords: '', lyrics: '' },
  { id: 7, name: 'Outro',   type: 'outro',   bars: 4,  chords: '', lyrics: '' },
]

interface Props {
  onMetaChange?: (meta: { key: string; tempo: number; timeSig: string }) => void
}

export default function SongStructureBuilder({ onMetaChange }: Props) {
  const nextIdRef = useRef(DEFAULT_SECTIONS.length + 1)
  const [songKey, setSongKey]   = useState('C')
  const [tempo, setTempo]       = useState(120)
  const [timeSig, setTimeSig]   = useState('4/4')
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS)
  const [title, setTitle]       = useState('Untitled Song')
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    onMetaChange?.({ key: songKey, tempo, timeSig })
  }, [songKey, tempo, timeSig, onMetaChange])

  const updateSection = (id: number, patch: Partial<Section>) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const addSection = (type: SectionType) => {
    const meta = SECTION_TYPES[type]
    setSections(prev => [...prev, { id: nextIdRef.current++, name: meta.label, type, bars: 8, chords: '', lyrics: '' }])
    setExpandedIds(prev => new Set(prev).add(nextIdRef.current - 1))
  }

  const removeSection = (id: number) => {
    setSections(prev => prev.filter(s => s.id !== id))
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const transposeAllChords = (semitones: number) => {
    const keyIdx = NOTE_NAMES_FULL.indexOf(songKey)
    if (keyIdx !== -1) {
      setSongKey(NOTE_NAMES_FULL[((keyIdx + semitones) % 12 + 12) % 12])
    }
    setSections(prev => prev.map(s => ({
      ...s,
      chords: s.chords.split(/[\s,]+/).filter(Boolean).map(c => transposeChordName(c, semitones)).join('  ')
    })))
  }

  const saveSong = () => {
    const data = { title, key: songKey, tempo, timeSig, sections }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const loadSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string)
        if (data.title) setTitle(data.title)
        if (data.key) setSongKey(data.key)
        if (data.tempo) setTempo(data.tempo)
        if (data.timeSig) setTimeSig(data.timeSig)
        if (data.sections) setSections(data.sections.map((s: Section) => ({ ...s })))
      } catch { /* invalid file */ }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const totalBars = sections.reduce((acc, s) => acc + s.bars, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="w-full space-y-4">

      {/* Song metadata card */}
      <div className="rounded-2xl border border-studio-border bg-studio-surface p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Zap size={15} className="text-emerald-400" />
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
            <select
              value={songKey}
              onChange={e => setSongKey(e.target.value)}
              className="h-8 px-2 text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-emerald-500/60 transition-all appearance-none"
            >
              {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
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

      {/* Transpose panel */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-studio-border bg-studio-surface/50">
        <span className="text-[10px] uppercase tracking-widest text-studio-muted shrink-0">Transpose</span>
        <div className="flex items-center gap-1 flex-wrap">
          {[-12,-6,-3,-2,-1,1,2,3,6,12].map(n => (
            <button key={n} onClick={() => transposeAllChords(n)}
              className="h-7 px-2 rounded-md border border-studio-border text-[10px] font-mono text-studio-muted hover:text-studio-accent hover:border-studio-accent/40 hover:bg-studio-accent/5 transition-all">
              {n > 0 ? `+${n}` : n}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-studio-muted ml-auto">semitones</span>
      </div>

      {/* Section list */}
      <div className="space-y-2 max-h-[calc(100vh-520px)] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {sections.map((section) => {
            const meta = SECTION_TYPES[section.type]
            const isExpanded = expandedIds.has(section.id)
            return (
              <motion.div
                key={section.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className={twMerge(
                  'rounded-xl border border-studio-border bg-studio-surface transition-all',
                  draggedId === section.id ? 'opacity-50' : ''
                )}
                draggable
                onDragStart={() => setDraggedId(section.id)}
                onDragOver={e => { e.preventDefault() }}
                onDrop={() => {
                  if (draggedId === null || draggedId === section.id) return
                  setSections(prev => {
                    const from = prev.findIndex(s => s.id === draggedId)
                    const to = prev.findIndex(s => s.id === section.id)
                    const next = [...prev]
                    const [item] = next.splice(from, 1)
                    next.splice(to, 0, item)
                    return next
                  })
                  setDraggedId(null)
                }}
                onDragEnd={() => setDraggedId(null)}
              >
                {/* Section header row */}
                <div className="group flex items-center gap-3 p-3 hover:border-studio-border/80 hover:-translate-y-px transition-all">
                  <GripVertical size={14} className="text-studio-muted/30 group-hover:text-studio-muted/60 cursor-grab shrink-0" />
                  <span className={twMerge('text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border shrink-0', meta.color)}>{meta.label}</span>
                  <input
                    value={section.name}
                    onChange={e => updateSection(section.id, { name: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-medium text-studio-text focus:outline-none min-w-0"
                  />
                  <div className="flex items-center gap-1 text-[10px] text-studio-muted font-mono shrink-0">
                    <input type="number" min={1} max={64} value={section.bars} onChange={e => updateSection(section.id, { bars: Number(e.target.value) || 4 })} className="w-10 text-center bg-studio-bg border border-studio-border rounded px-1 py-0.5 text-[10px] font-mono text-studio-muted focus:outline-none focus:border-emerald-500/60" />
                    <span>bars</span>
                  </div>
                   <button
                     onClick={() => setExpandedIds(prev => {
                       const next = new Set(prev)
                       if (next.has(section.id)) {
                         next.delete(section.id)
                       } else {
                         next.add(section.id)
                       }
                       return next
                     })}
                     className="p-1 rounded text-studio-muted/50 hover:text-studio-accent hover:bg-studio-accent/10 transition-all shrink-0"
                   >
                     {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                   </button>
                  <button onClick={() => removeSection(section.id)} className="p-1 rounded text-studio-muted/30 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={12} /></button>
                </div>

                {/* Expanded panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key={`expand-${section.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-t border-studio-border/40"
                    >
                      <div className="p-4 space-y-3 bg-studio-bg/30">
                        {/* Chord input */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-studio-muted mb-1.5 block">Chords</label>
                          <input
                            value={section.chords}
                            onChange={e => updateSection(section.id, { chords: e.target.value })}
                            placeholder="C  Am  F  G"
                            className="w-full h-9 px-3 text-sm font-mono rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-studio-accent/60 transition-all placeholder-studio-muted/40"
                          />
                        </div>
                        {/* Chord pills */}
                        {section.chords.trim() && (
                          <div className="flex flex-wrap gap-1.5">
                            {section.chords.split(/[\s,]+/).filter(Boolean).map((chord, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg border border-studio-accent/30 bg-studio-accent/10 text-studio-accent font-mono text-xs">
                                {chord}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Lyrics */}
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-studio-muted mb-1.5 block">Lyrics <span className="text-studio-muted/50 normal-case tracking-normal">(one line per bar)</span></label>
                          <textarea
                            value={section.lyrics}
                            onChange={e => updateSection(section.id, { lyrics: e.target.value })}
                            placeholder="Enter lyrics here…"
                            rows={4}
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-studio-border bg-studio-bg text-studio-text focus:outline-none focus:border-studio-accent/60 transition-all resize-none font-mono placeholder-studio-muted/40 leading-6"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
        <label className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-studio-border bg-studio-surface hover:bg-studio-bg text-studio-muted hover:text-studio-text text-xs font-semibold transition-colors cursor-pointer">
          <Upload size={13} /> Load
          <input type="file" accept=".json" className="hidden" onChange={loadSong} />
        </label>
        <button onClick={saveSong} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border border-studio-border bg-studio-surface hover:bg-studio-bg text-studio-muted hover:text-studio-text text-xs font-semibold transition-colors">
          <Save size={13} /> Save
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-600/20">
          <Zap size={13} /> Export MIDI
        </button>
      </div>
    </motion.div>
  )
}
