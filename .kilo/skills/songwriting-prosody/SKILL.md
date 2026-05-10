# Skill: Songwriting & Prosody
**Description:** Use this skill when generating lyrics, analyzing song structure, or matching lyrical stress patterns to musical beats.

---

## Instructions
Use this skill to ensure lyrical content aligns with the musicality, rhythm, and emotional intent of the track.

### 1. Song Structures
When suggesting structural changes or organizing the UI, reference these standard forms:
*   **AABA (Thirty-Two-Bar Form):** Verse-Verse-Bridge-Verse. Common in jazz and early pop.
*   **Verse-Chorus:** V1-C-V2-C-Bridge-C. The modern standard.
*   **Through-composed:** Continuous movement without repeating sections; often used in progressive or narrative styles.

### 2. Prosody & Rhythm
Match word stresses to the time signature (typically 4/4). Ensure accented syllables land on the "downbeats" (Beat 1 or 3):
*   **Iambic (Short-Long):** "The **HEART** is **BEAT**-ing **FAST**." (Great for steady folk/rock).
*   **Trochaic (Long-Short):** "**DOU**-ble, **DOU**-ble, **TOIL** and **TROU**-ble." (Good for driving, urgent rhythms).
*   **Dactylic (Long-Short-Short):** "**HICK**-o-ry, **DICK**-o-ry, **DOCK**." (Waltz-time / 3/4 feel).

### 3. Local LLM Synergy (Qwen/DeepSeek)
When prompting the local model for creative writing, always include the **Mood**, **Key**, and **Rhyme Scheme** to keep the output grounded:
*   *Prompt Template:* "Generate 4 lines of lyrics in [Key] Major, with a [Mood] vibe, following an [AABB/ABAB] rhyme scheme. Ensure the meter is [Iambic/Trochaic]."

### 4. Emotional Tone Mapping
Use these heuristics to suggest musical backdrops for specific lyrical themes:
| Mode | Character | Suggested Lyrical Theme |
| :--- | :--- | :--- |
| **Lydian** | Ethereal, Dreamy | Wonder, Space, Transcendence |
| **Dorian** | Sophisticated, Soulful | Bittersweet memories, Urban life |
| **Phrygian** | Tense, Dark, Exotic | Conflict, Mystery, Anxiety |
| **Mixolydian** | Bright, Bluesy, Gritty | Freedom, Road trips, Classic Rock |

---

## Implementation Guidelines
*   **Inspiration, Not Replacement:** Provide options and prompts rather than writing the whole song for the user.
*   **Section Transitions:** Suggest musical "lifts" when transitioning from Verse to Chorus (e.g., adding a pre-chorus or increasing harmonic rhythm).
*   **Syllable Counting:** Assist the user in balancing line lengths to ensure they fit within a standard 4-bar or 8-bar MIDI phrase.