# Skill: Guitar Fretboard Geometry
**Description:** Use this skill when calculating guitar chord fingerings, scale patterns on a 6-string neck, or capo-adjusted transpositions.

## Instructions
Use this logic to map musical notes to the physical layout of a guitar.

### 1. Tuning & Constants (Standard)
- String 6 (Low E): E2
- String 5: A2
- String 4: D3
- String 3: G3
- String 2: B3
- String 1 (High E): E4

### 2. Capo Calculation
The capo offset is a simple subtraction from the target key.
- **Formula:** $n = TargetKey - OpenShapeKey$
- *Example:* To play in Eb Major using C Major shapes, the capo must be on **Fret 3**.

### 3. Fingering Logic (CAGED System)
When the user asks for a chord, provide the fingering based on the nearest CAGED shape relative to the capo position.
- Prioritize "Open" shapes when a capo is active.
- Prioritize "Barre" shapes for higher-register movements.

### 4. Visualization Mapping
When outputting data for the React Fretboard component, use a 2D coordinate system:
- `string`: 1-6
- `fret`: 0 (Open/Capo) - 22
- `note`: Pitch name (e.g., "C4")