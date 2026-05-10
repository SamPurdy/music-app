# Project: SonicArchitect - Music Theory & Ableton Integration

## 1. Core Purpose
SonicArchitect is a creative tool designed to bridge the gap between abstract music theory and practical DAW production. It focuses on song structure (chords and lyrics) while maintaining a high-fidelity, bi-directional link with **Ableton Live**.

---

## 2. Technical Stack & Environment
*   **Frontend:** React 19 (Vite)
*   **Backend:** Python 3.12 (FastAPI)
*   **Local AI:** Qwen 3.5-9B / DeepSeek-R1 (Accessed via LM Studio)
*   **Terminal/Shell:** **BASH (Git Bash)**. *Do not use PowerShell or CMD.*
*   **Hardware Target:** Optimized for local NVIDIA RTX 50-series GPUs and high-core-count CPUs.

---

## 3. Key Feature Modules

### A. Music Theory Engine
*   **Functional Harmony:** Provide chord suggestions based on scale degrees (I-IV-V, ii-V-I, etc.) and the Circle of Fifths.
*   **The Capo Calculator:** A dedicated module to calculate fret positions for specific keys. (Example: "I want to play in G Major using C Major shapes.")
*   **Mode-Based Scaling:** Visualize intervals for Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, and Locrian scales on a virtual fretboard.

### B. Songwriter’s Workbench
*   **Chord/Lyric Alignment:** A text-based editor where chord changes are anchored to specific syllables or words.
*   **Section Management:** Drag-and-drop song sections (Verse, Chorus, Bridge, Solo) to reorder the structural flow.

### C. Ableton Live Integration
*   **MIDI Loopback:** Send MIDI Note and CC data to Ableton via `python-rtmidi`.
*   **Scene Triggering:** Map song sections in the UI to specific Scenes in Ableton’s Session View.
*   **Macro Controller:** Create a slider dashboard that maps to Ableton Device Racks for real-time mixing (e.g., Bass Cutoff, Reverb Damping).

---

## 4. Creative "Wildcard" Features
*   **Topographic Visualizer:** A 3D landscape generator using Three.js that "erodes" or "builds" terrain based on MIDI velocity and frequency density.
*   **AI Lyric Co-Pilot:** A local LLM connection that suggests rhymes or thematic lines based on the selected musical key and tempo.
*   **Dynamic Fretboard UI:** A high-fidelity guitar fretboard that adapts its display based on the "Capo" setting and current scale.

---

## 5. Development Guidelines for Agents
1.  **Strict Shell Rules:** When running installation scripts or file operations, **ALWAYS** use Bash syntax. 
2.  **Performance First:** Since this is a local desktop-style app, prioritize sub-millisecond latency for MIDI events.
3.  **Clean Code:** Use functional React components and type-safe Python logic. 
4.  **No Cloud Bloat:** Avoid external API calls for things that can be calculated locally or handled by local LLMs.

---

## 6. Setup Commands (Bash)
```bash
# Setup Backend
python -m venv venv
source venv/Scripts/activate
pip install fastapi uvicorn mido python-rtmidi

# Setup Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install lucide-react framer-motion axios