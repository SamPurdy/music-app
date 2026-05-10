# Skill: Music Theory Mathematics
**Description:** Use this skill when calculating musical intervals, note frequencies, chord formulas, or Circle of Fifths relationships.

## Instructions
When performing music theory calculations, adhere to these mathematical standards:

### 1. Frequency Calculation
Use the equal temperament formula to derive frequencies. Do not use hardcoded look-up tables.
$$f = f_0 \cdot 2^{n/12}$$
- $f_0$ (Standard Pitch): **440Hz** (A4).
- $n$: Number of half-steps away from A4.

### 2. Interval Mappings (Half-Steps)
- Minor 2nd: 1 | Major 2nd: 2
- Minor 3rd: 3 | Major 3rd: 4
- Perfect 4th: 5 | Tritone: 6
- Perfect 5th: 7 | Minor 6th: 8
- Major 6th: 9 | Minor 7th: 10
- Major 7th: 11 | Octave: 12

### 3. Tonal Library Integration
When writing JavaScript/TypeScript logic, prioritize the `tonal` library:
- Use `Note.transpose` for interval shifts.
- Use `Chord.get` to retrieve interval arrays for specific chord qualities (e.g., "m9", "maj7#11").

### 4. Constraints
- Always explain the Roman Numeral Analysis context (e.g., "This is a bII7 substitution for a V7 chord").
- Ensure all transposition logic accounts for enharmonic equivalents (e.g., G# vs Ab).