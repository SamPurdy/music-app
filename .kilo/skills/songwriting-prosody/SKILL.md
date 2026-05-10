# Skill: Songwriting & Prosody
**Description:** Use this skill when generating lyrics, analyzing song structure, matching lyrical stress patterns to musical beats, or working with the SongStructureBuilder component.

---

## Instructions

### 1. SongStructureBuilder Context
Song sections in the app (`src/components/SongStructureBuilder.tsx`) each have:
- `name`: string (Verse, Chorus, Bridge, etc.)
- `chords`: string[] (e.g., `["Am", "F", "C", "G"]`)
- `lyrics`: string (freeform text aligned with chords)
- Sections can be reordered by drag-and-drop
- Song is saved as JSON to `public/songs/`

### 2. Standard Song Structures
- **Verse-Chorus:** V1-C-V2-C-Bridge-C — the modern pop/rock standard
- **AABA:** Verse-Verse-Bridge-Verse — jazz/early pop standard
- **Through-composed:** No repeating sections — progressive/narrative styles

### 3. Prosody & Rhythm
Match word stresses to the time signature (4/4 default). Accented syllables should land on beats 1 or 3:
- **Iambic (Short-Long):** "The HEART is BEAT-ing FAST" — steady folk/rock
- **Trochaic (Long-Short):** "DOU-ble, TOIL and TROU-ble" — driving, urgent rhythms
- **Dactylic (Long-Short-Short):** "HICK-o-ry DICK-o-ry DOCK" — 3/4 waltz feel

### 4. Emotional Tone Mapping
| Mode | Character | Lyrical Theme |
|------|-----------|---------------|
| Lydian | Ethereal, Dreamy | Wonder, space, transcendence |
| Dorian | Sophisticated, Soulful | Bittersweet memories, urban life |
| Phrygian | Tense, Dark, Exotic | Conflict, mystery, anxiety |
| Mixolydian | Bright, Bluesy | Freedom, road trips, classic rock |
| Aeolian (Natural Minor) | Melancholic | Loss, nostalgia, longing |

### 5. Section Transition Tips
- **Verse → Pre-Chorus**: Increase harmonic rhythm (more chord changes per bar)
- **Pre-Chorus → Chorus**: Land on V chord before the chorus for maximum lift
- **Chorus → Bridge**: Drop to a more sparse arrangement to create contrast
- **Bridge → Final Chorus**: Build energy back up, consider key change (+1 or +2 semitones)

---

## Guidelines
- **Inspiration, Not Replacement**: Give options and prompts — don't write the whole song
- **Section Transitions**: Suggest musical "lifts" with chord suggestions
- **Syllable Matching**: Help balance line lengths to fit 4-bar or 8-bar phrases
