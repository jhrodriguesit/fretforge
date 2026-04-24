# PLANNING.md

## What is Fretforge?
An interactive web app for guitar players to study music theory through harmonic fields, scale patterns, and ear training exercises.

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Tone.js (audio, Phase 5+)
- Vitest + React Testing Library
- GitHub Actions CI

## Design Reference
See `docs/design-reference.html` for the target look and feel. This is the visual north star — match its colors, spacing, typography, component sizes, and layout patterns as closely as possible when building components.

## Music Theory Reference
See `/docs/music-theory-reference.md` for the harmonic fields and music theory reference. This is the source of truth when making decisions about music theory.

## Design System

### Colors
- Background: #0D0D0D
- Surface/Cards: #1A1A1A
- Elevated surface: #222222
- Border: #2A2A2A
- Accent (orange): #F5A623
- Accent glow: rgba(245, 166, 35, 0.3)
- Text primary: #FFFFFF
- Text secondary: #888888
- Text muted: #555555

### Typography
- Headings / Chord names / Notes: JetBrains Mono
- UI text / labels / body: DM Sans
- Degree labels: uppercase, letter-spaced, orange (#F5A623)

### Component Patterns
- Note selector: 44px circles, dark bg, orange fill + box-shadow glow when active
- Mode toggle: pill shape, orange fill on active side
- Chord cards: dark surface (#1A1A1A), 12px border-radius, subtle border (#2A2A2A), ~220px wide
- Info cards: bordered, orange uppercase label header
- Dark theme only

### Chord Diagram Style (vertical, standard guitar chord chart)
- 6 vertical lines = strings (thickest on left = low E)
- 4-5 horizontal lines = frets
- Thick top bar = nut (or fret number label if position is higher on the neck)
- Filled black circles = finger positions
- Numbered circles at bottom = finger numbers (1-4)
- Empty circles above nut = open strings
- "X" above nut = muted strings
- Chord name centered above the diagram

### Fretboard Visualization (horizontal, for Scale Explorer)
- 6 horizontal lines = strings (low E at bottom, high E at top)
- 12+ vertical lines = frets
- Fret markers at positions 3, 5, 7, 9, 12 (double dot at 12)
- Root notes = orange filled circles with note name
- Other scale tones = white/gray circles with note name
- Fret numbers along the top
- Thick line at fret 0 = nut

## Project Structure
src/
├── App.tsx + App.test.tsx
├── main.tsx
├── index.css
├── data/                          # Music theory data (pure data, no React)
│   ├── notes.ts + notes.test.ts
│   ├── intervals.ts + intervals.test.ts
│   ├── harmonicField.ts + harmonicField.test.ts
│   ├── chords.ts + chords.test.ts
│   └── scales.ts + scales.test.ts
├── utils/                         # Pure functions
│   ├── musicTheory.ts + musicTheory.test.ts
│   ├── audioEngine.ts             # NO tests (audio excluded)
│   └── guitarUtils.ts + guitarUtils.test.ts
├── components/                    # Feature folders
│   ├── Header/
│   ├── RootSelector/
│   ├── ScaleModeToggle/
│   ├── HarmonicField/             # includes ChordCard, ChordDiagram
│   ├── ScaleExplorer/             # includes Fretboard, ScaleTypeTabs
│   ├── TheoryNotes/
│   ├── ExerciseMode/
│   └── shared/                    # PlayButton, VoicingNav
├── hooks/
│   ├── useHarmonicField.ts + test
│   ├── useAudio.ts                # NO tests
│   └── useExercise.ts + test
└── types/
└── music.ts

## Conventions
- Co-located tests: every file gets a `.test.ts(x)` in the same folder
- Exception: no tests for audio files (audioEngine.ts, useAudio.ts)
- Components use feature folders: ComponentName/ComponentName.tsx + ComponentName.test.tsx
- All music theory logic lives in data/ and utils/, not in components
- Pure functions preferred — components should be thin UI wrappers
- Single responsibility: data files export data, utils export functions, components render UI


### Guitar Standard Tuning
Low → High: E2, A2, D3, G3, B3, E4

## Phases Overview (current status)
- [x] Phase 1: Foundation + Root Selector + Mode Toggle
- [x] Phase 2: Harmonic Field + Chord Cards + Chord Diagrams
- [x] Phase 3: Scale Explorer + Fretboard Visualization
- [ ] Phase 4: Theory Notes
- [ ] Phase 5: Audio Engine (Tone.js)
- [ ] Phase 6: Exercise Mode