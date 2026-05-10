import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { CreativeSuggestion } from '@/types'
import { suggestProgressions } from '@/lib/music-theory/progressions'
import { Sparkles, Flame, Zap, Wand2, ArrowRight } from 'lucide-react'

export default function CreativeInspiration() {
  const [suggestions, setSuggestions] = useState<CreativeSuggestion[]>([])
  const [currentKey, setCurrentKey] = useState('C')
  const currentScale = 'major'
  const [currentGenre, setCurrentGenre] = useState('pop')

  // Debounced key change to avoid too many suggestions
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuggestions((prev) => [
        ...prev.filter(s => !s.content.startsWith('New chord')),
        ...suggestProgressions(currentKey, currentGenre).map(p => ({ 
          type: p.type as CreativeSuggestion['type'], 
          content: `Try ${p.content}`, 
          context: p.context, 
          confidence: 0.8 
        }))
      ])
    }, 500)

    return () => clearTimeout(timeout)
  }, [currentKey, currentGenre])

  const clearSuggestions = () => {
    setSuggestions([])
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-xl bg-gradient-to-br from-studio-surface via-studio-bg/95 to-studio-surface border border-studio-border shadow-lg studio-card-gradient mb-3 flex items-center gap-3 group hover:border-studio-accent/50 transition-colors"
      >
        <Sparkles size={16} className="text-studio-accent shrink-0 group-hover:animate-spin-slow transition-all duration-200 inline-block self-end -mb-1.5 pr-2" />
        <div>
          <h2 className="text-sm font-semibold text-studio-text flex items-center gap-2">
            Creative Inspiration
            <span className="text-[10px] bg-studio-muted/30 px-1.5 py-0.5 rounded-full border border-studio-border text-studio-muted uppercase tracking-wider">AI-Assisted</span>
          </h2>
          <p className="text-[10px] text-studio-muted mt-0.5">Let the muse guide your songwriting</p>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="px-4 pb-2 rounded-xl bg-gradient-to-br from-studio-surface/80 via-studio-bg/90 to-studio-surface border border-studio-border shadow-md studio-card-gradient space-y-3">
        
        {/* Key & Scale Row */}
        <div className="grid grid-cols-[1fr_auto_165px] gap-3 items-center">
          
          {/* Key Selector */}
          <div className="flex-1 min-w-0 relative group">
            <label className="text-xs font-medium text-studio-muted block mb-1.5 flex items-center gap-1.5 pl-0.5">
              <Wand2 size={11} className="text-studio-accent shrink-0 self-end -mt-0.5" />
              Key Selection
            </label>
            <select
              value={currentKey}
              onChange={(e) => setCurrentKey(e.target.value.toUpperCase())}
              className="relative w-full h-10 pl-3 pr-8 text-sm rounded-lg border-2 border-studio-border bg-studio-bg/95 backdrop-blur-sm text-studio-text appearance-none focus:outline-none focus:border-studio-accent focus:ring-2 focus:ring-studio-accent/20 transition-all font-medium shadow-inner cursor-pointer"
            >
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((k) => (
                <option key={k} value={k}>{k} Major</option>
              ))}
            </select>
          </div>

          {/* Scale Badge */}
          <div className="flex-1 min-w-0 relative p-2 rounded-lg border border-studio-border/60 bg-gradient-to-br from-purple-500/8 to-transparent backdrop-blur-sm shadow-inner flex items-center justify-between group-focus-within:border-t focus-within:border-studio-accent">
            <label className="text-xs font-medium text-studio-muted block mb-0.5 ml-1 flex items-center gap-1">
              <Flame size={11} className="text-purple-400 shrink-0 self-end -mt-0.5" />
              Mode
            </label>
            <div className="flex items-center gap-2 min-w-0 w-full p-[2px] rounded border bg-studio-bg/50">
              <span className="w-full text-center h-8 px-3 text-sm font-bold text-studio-accent uppercase tracking-wide rounded flex-shrink-0 ring-2 ring-purple-400/30 shadow-[0_0_15px_rgba(192,132,252,0.3)] relative">
                {currentScale}
              </span>
            </div>
          </div>

          {/* Genre Selector */}
          <div style={{ maxWidth: '165px' }} className="flex-[2] relative group">
            <label className="text-xs font-medium text-studio-muted block mb-1.5 flex items-center gap-1.5 pl-0.5">
              <Sparkles size={11} className="text-yellow-400 shrink-0 self-end -mt-0.5" />
              Genre Vibe
            </label>
            <select
              value={currentGenre}
              onChange={(e) => setCurrentGenre(e.target.value)}
              className="relative w-full h-10 pl-3 pr-8 text-sm rounded-lg border border-studio-border bg-studio-bg/95 backdrop-blur-sm text-studio-muted appearance-none focus:outline-none focus:border-studio-accent transition-all cursor-default font-medium shadow-inner"
            >
              {['pop', 'jazz', 'blues', 'rock', 'classical', 'folk'].map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Button */}
        <button
          onClick={clearSuggestions}
          disabled={suggestions.length === 0}
          className="group relative w-full py-2.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] border border-studio-border/60 hover:border-yellow-400/40 hover:text-yellow-300/80 transition-all studio-button-gradient shadow-sm flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Clear icon */}
          {suggestions.length > 0 && (
            <span className="absolute left-3 text-studio-muted transition-all">✕</span>
          )}
          Clear Suggestions
        </button>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-auto p-4 rounded-xl bg-gradient-to-br from-studio-surface/50 via-studio-bg/80 to-studio-surface border border-studio-border shadow-md studio-card-gradient relative">
        
        {/* Section header */}
        <h3 className="text-xs font-semibold text-studio-muted uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>✨ Suggestions</span>
          <span className={`px-2.5 py-1 rounded-lg flex-shrink-0 text-[10px] font-bold border transition-colors ${
            suggestions.length > 0 
              ? 'bg-studio-accent/15 text-studio-accent border-studio-accent/40' 
              : 'bg-black/[0.2] text-studio-muted border-white/[0.05]'
          }`}>
            {suggestions.length} idea{ suggestions.length !== 1 ? 's' : '' }
          </span>
        </h3>

        {/* Empty State */}
        {suggestions.length === 0 ? (
          <div className="h-full min-h-[180px] flex items-center justify-center relative overflow-hidden rounded-lg border border-studio-border bg-studio-bg/50">
            <div className="text-center max-w-xs px-4 text-studio-muted">
              {/** Icon container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mb-3 p-3 rounded-xl bg-studio-surface/50 border border-studio-border inline-flex items-center gap-2.5 shadow-sm studio-glass mb-2 max-w-[160px] mx-auto justify-center"
              >
                <Zap size={16} className="text-studio-muted flex-shrink-0" />
                <ArrowRight size={16} className="text-studio-muted flex-shrink-0 group-hover:rotate-180 transition-transform duration-500 cursor-default" />
              </motion.div>
              
              <p className="text-xs text-studio-muted font-medium">Select a key to receive inspirational suggestions</p>
            </div>
          </div>
        ) : (
          /* Suggestions */
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.content + index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-3 rounded-lg bg-gradient-to-br from-white/[0.01] via-studio-bg/90 to-white/[0.01] border border-studio-border hover:border-studio-accent/40 cursor-default studio-glass hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    {/* Type badge */}
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.75 rounded border bg-black/[0.3] shadow-sm ${
                      suggestion.type === 'chord' ? 'text-blue-400' :
                      suggestion.type === 'lyric' ? 'text-pink-400' :
                      suggestion.type === 'melody' ? 'text-green-400' :
                      suggestion.type === 'structure' ? 'text-purple-400' : 'text-orange-400'
                    }`}>
                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                    </span>
                    
                    {/* Content */}
                    <span className="text-xs text-studio-text font-medium truncate">{suggestion.content}</span>
                  </div>

                  {/* Confidence indicator */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-studio-border/50 bg-studio-surface shrink-0">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400/80 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
                    />
                    <span className="text-[9px] font-mono text-studio-muted">{Math.round(suggestion.confidence * 100)}%</span>
                  </div>
                </div>

                {/* Context */}
                {suggestion.context && (
                  <p className="mt-2 text-[9px] text-studio-muted uppercase tracking-wider font-medium">
                    <span className="opacity-50 mr-1">//</span> {suggestion.context}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-studio-border/50">
        <div className="flex items-center gap-2 text-[10px] text-studio-muted uppercase tracking-wider px-3 py-2 rounded-lg bg-white/[0.01] border border-studio-border hover:border-studio-accent/40 transition-all studio-glass">
          {/* Status indicator */}
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/80 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
          
          {/* Metadata */}
          <div className="flex flex-col items-start">
            <span className="font-mono text-studio-accent tracking-wide">{currentKey}</span>
            <span className="text-[9px] opacity-70">{currentScale.toUpperCase()}</span>
          </div>
          
          {/* Genre */}
          <span className="ml-1 opacity-60" style={{ opacity: currentGenre === 'pop' ? '0.85' : '0.4' }}>{currentGenre}</span>
        </div>
      </div>
    </div>
  )
}
