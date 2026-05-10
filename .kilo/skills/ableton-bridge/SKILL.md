# Skill: Ableton MIDI Protocol
**Description:** Use this skill when writing Python scripts to send MIDI Notes, CC data, or triggering Ableton Scenes via the mido library.

## Instructions
This skill governs the communication bridge between the FastAPI backend and Ableton Live.

### 1. Environment & Shell
- **Strict Rule:** All terminal executions (pip installs, script runs) must use **Git Bash** syntax.
- **Pathing:** Use forward slashes `/` for paths even on Windows to ensure Bash compatibility.

### 2. MIDI Implementation (Python)
Use the `mido` library for port handling:
```python
import mido

# Standard logic for finding the virtual MIDI port
def get_ableton_port():
    ports = mido.get_output_names()
    # Look for loopMIDI or virtual ports
    return [p for p in ports if 'Ableton' in p or 'loop' in p]