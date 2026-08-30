export interface ChordFunctionInfo {
  roman: string
  name: string
  shortDesc: string
  fullDesc: string
  tension: number        // 0 (stable) → 10 (highly unstable)
  commonCadences: string[]
  songwritingTip: string
  color: 'sky' | 'violet' | 'amber' | 'emerald' | 'rose' | 'purple' | 'orange'
}

const CHORD_FUNCTIONS: Record<string, ChordFunctionInfo> = {
  // ── Major scale functions ──────────────────────────────────────────────
  'I': {
    roman: 'I',
    name: 'Tonic',
    shortDesc: 'Home base — the point of rest and resolution',
    fullDesc: 'The I chord is the tonal center of the key. It feels stable and resolved, like arriving home after a journey. Progressions often begin and end here. Its stability makes everything around it feel either like departure or return.',
    tension: 1,
    commonCadences: ['V → I (perfect authentic)', 'IV → I (plagal / "Amen")', 'I → IV → V → I'],
    songwritingTip: 'Starting on I is safe and grounded. Starting on something else and resolving to I creates a satisfying arc.',
    color: 'sky',
  },
  'ii': {
    roman: 'ii',
    name: 'Supertonic',
    shortDesc: 'Pre-dominant — builds momentum toward the V',
    fullDesc: 'The ii chord sits a step above the tonic and naturally wants to move forward toward the dominant (V). In jazz this is the backbone of the ii–V–I cadence. In pop and folk it adds smooth forward motion without being as strong as IV.',
    tension: 4,
    commonCadences: ['ii → V → I (jazz turnaround)', 'I → ii → V → I', 'ii → IV → V'],
    songwritingTip: 'Substitute ii for IV when you want smoother voice-leading — they share two common tones.',
    color: 'violet',
  },
  'iii': {
    roman: 'iii',
    name: 'Mediant',
    shortDesc: 'Ambiguous — tonic substitute with a warm, dreamy quality',
    fullDesc: 'The iii chord shares two notes with the tonic I chord, making it a soft substitute for home. It has an introspective, bittersweet quality and is often used as a bridge between I and IV, or as an unexpected color chord.',
    tension: 3,
    commonCadences: ['I → iii → IV', 'iii → vi → II → V', 'I → iii → ii → V'],
    songwritingTip: 'Use iii to "delay" a return to I without fully leaving home. It feels like a gentle afterthought.',
    color: 'purple',
  },
  'IV': {
    roman: 'IV',
    name: 'Subdominant',
    shortDesc: 'Departure — a sense of lifting away from home',
    fullDesc: 'The IV chord is the departure chord — it moves away from the tonic, creating space and warmth. The plagal cadence (IV → I) is the "Amen" cadence of hymns, offering a gentle resolution. IV is the heart of folk, gospel, and many pop choruses.',
    tension: 3,
    commonCadences: ['IV → I (plagal / "Amen")', 'I → IV → V → I', 'IV → V → I'],
    songwritingTip: 'IV before a chorus creates an uplifting "lift off" feeling. IV → I (without V) gives a spiritual, settled resolution.',
    color: 'emerald',
  },
  'V': {
    roman: 'V',
    name: 'Dominant',
    shortDesc: 'Maximum tension — the strongest pull back to I',
    fullDesc: 'The V chord is the engine of tonal harmony. Its instability creates an irresistible pull toward the tonic. The tritone formed by its 3rd and 7th (in V7) is the most tense interval in Western music. Every resolution in classical, jazz, and pop music is built on this relationship.',
    tension: 9,
    commonCadences: ['V → I (perfect authentic cadence)', 'ii → V → I', 'I → IV → V → I', 'V7 → I'],
    songwritingTip: 'A V at the end of a phrase creates a question; I answers it. Half-cadences (ending on V) leave the listener wanting more.',
    color: 'amber',
  },
  'vi': {
    roman: 'vi',
    name: 'Submediant',
    shortDesc: 'Relative minor — emotional depth and bittersweet color',
    fullDesc: 'The vi chord is the relative minor of the key, sharing two notes with I. It\'s the most common tonic substitute, adding emotional weight and melancholy without fully destabilizing the key. The I–V–vi–IV progression has defined pop music for decades.',
    tension: 2,
    commonCadences: ['I → V → vi → IV (pop anthem)', 'vi → IV → I → V', 'IV → V → vi (deceptive cadence)'],
    songwritingTip: 'Ending a phrase on vi instead of I (deceptive cadence) creates surprise and emotional resonance — listeners expected home but got something more.',
    color: 'violet',
  },
  'vii°': {
    roman: 'vii°',
    name: 'Leading Tone',
    shortDesc: 'Highly unstable — demands resolution to I',
    fullDesc: 'The vii° chord is built on the leading tone — a semitone below the tonic — and is the most harmonically tense diatonic chord. Its diminished quality (two stacked minor thirds) creates an urgent need to resolve upward to I. Often found in classical and jazz as a V substitute.',
    tension: 10,
    commonCadences: ['vii° → I', 'V → vii° → I', 'ii → vii° → I'],
    songwritingTip: 'Use vii° sparingly for dramatic effect — it\'s the most urgent chord in the key. A vii° → I resolution feels inevitable and powerful.',
    color: 'amber',
  },

  // ── Minor scale functions ──────────────────────────────────────────────
  'i': {
    roman: 'i',
    name: 'Tonic Minor',
    shortDesc: 'Dark home — stable but with a shadow over it',
    fullDesc: 'The minor tonic carries the same sense of rest as major I, but with an inherent melancholy. It is the starting and ending point of minor key music — grounded but never fully "at peace." Songs can sit on i for a long time without feeling unresolved.',
    tension: 1,
    commonCadences: ['v → i', 'iv → i', '♭VII → i', 'i → iv → V → i'],
    songwritingTip: 'In minor keys, ending on i can feel resigned rather than triumphant. For a more hopeful ending, try resolving to ♭III (the relative major) instead.',
    color: 'violet',
  },
  'ii°': {
    roman: 'ii°',
    name: 'Diminished Supertonic',
    shortDesc: 'Tense pre-dominant — darker than major ii',
    fullDesc: 'The diminished ii chord in minor keys has a harsher, more urgent quality than its major-key counterpart. Its diminished fifth creates dissonance that pushes strongly toward V and then resolution. Common in classical minor cadences.',
    tension: 7,
    commonCadences: ['ii° → V → i', 'i → ii° → V → i'],
    songwritingTip: 'ii°–V–i is the minor equivalent of ii–V–I in jazz. Add a 7th to make it iiø7 (half-diminished) for a smoother, jazzier sound.',
    color: 'amber',
  },
  '♭III': {
    roman: '♭III',
    name: 'Mediant Major',
    shortDesc: 'Relative major — a ray of light in a minor key',
    fullDesc: 'The ♭III chord is the relative major — the brightest diatonic chord in a minor key. Moving to ♭III feels like stepping into sunlight briefly before returning to minor. It\'s central to natural minor harmony and heavily used in rock and folk.',
    tension: 2,
    commonCadences: ['i → ♭III → ♭VII → iv', '♭III → ♭VII → i', 'i → ♭VI → ♭III → ♭VII'],
    songwritingTip: 'The progression i–♭VI–♭III–♭VII is one of the most powerful in rock music (think dramatic or anthemic moments).',
    color: 'sky',
  },
  'iv': {
    roman: 'iv',
    name: 'Minor Subdominant',
    shortDesc: 'Dark departure — more mournful than major IV',
    fullDesc: 'The minor iv chord creates a deeper, more somber departure than its major-key counterpart. The minor third gives it a sense of grief or longing. It is central to blues, flamenco, and much classical minor-key writing.',
    tension: 4,
    commonCadences: ['i → iv → V → i', 'iv → i (minor plagal)', 'iv → ♭VII → ♭III'],
    songwritingTip: 'Even in a major key song, borrowing iv from the parallel minor (modal mixture) adds emotional depth and surprise.',
    color: 'violet',
  },
  'v': {
    roman: 'v',
    name: 'Minor Dominant',
    shortDesc: 'Weak dominant — ambiguous, without the strong pull of V',
    fullDesc: 'The natural minor v chord (lowercase) lacks the leading tone found in the harmonic minor V, giving it a weaker pull toward resolution. This creates a more modal, floating quality rather than strong tonal tension. Common in folk, Dorian, and natural minor music.',
    tension: 5,
    commonCadences: ['v → i (weak resolution)', 'i → ♭VII → v → i'],
    songwritingTip: 'If you want urgency, raise the 7th to create a major V (harmonic minor). If you want ambiguity and a modal feel, keep v minor.',
    color: 'orange',
  },
  '♭VI': {
    roman: '♭VI',
    name: 'Flat Submediant',
    shortDesc: 'Dark majesty — strong, cinematic, powerful',
    fullDesc: 'The ♭VI chord is one of the most emotionally powerful chords in minor harmony. Its major quality within a minor key creates a sense of grandeur, sadness, and drama. It is ubiquitous in film scores, power ballads, and epic rock.',
    tension: 3,
    commonCadences: ['i → ♭VI → ♭III → ♭VII', '♭VI → ♭VII → i', '♭VI → V → i'],
    songwritingTip: 'The i–♭VI–♭VII–i loop creates an endless feeling of dramatic motion — great for cinematic or epic sections.',
    color: 'rose',
  },
  '♭VII': {
    roman: '♭VII',
    name: 'Subtonic',
    shortDesc: 'Modal tension — rock energy, no classical resolution',
    fullDesc: 'The ♭VII chord avoids the leading-tone pull of the harmonic minor, giving it a modal, open-ended quality. It\'s the defining chord of rock and modal music — powerful but not "classical." Moving ♭VII → i feels inevitable without being predictable.',
    tension: 6,
    commonCadences: ['♭VII → i', 'i → ♭VI → ♭VII → i', '♭III → ♭VII → i'],
    songwritingTip: 'A ♭VII before the final i creates a "rocking" resolution. It\'s why so much hard rock, metal, and cinematic music feels so driving.',
    color: 'orange',
  },
}

/** Look up a chord's function by its Roman numeral. Returns null if not found. */
export function getChordFunction(roman: string): ChordFunctionInfo | null {
  return CHORD_FUNCTIONS[roman] ?? null
}
