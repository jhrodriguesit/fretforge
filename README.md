# FretForge

An interactive web app for guitar players to study music theory through harmonic fields, scale patterns, and ear training exercises.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Vitest + React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # Dev server
npm run build    # Type-check + build
npm run test     # Tests (watch mode). Use `-- --run` for single run
npm run lint     # ESLint
```

## Project Structure

```
src/
├── App.tsx
├── index.css              # Tailwind @theme — design tokens
├── data/                  # Music theory data (pure data, no React)
├── utils/                 # Pure functions (music theory, guitar utilities)
├── components/            # Feature folders (Name/Name.tsx + Name.test.tsx)
│   ├── Header/
│   ├── RootSelector/
│   ├── ScaleModeToggle/
│   ├── HarmonicField/     # Chord cards + chord diagrams
│   ├── ScaleExplorer/     # Fretboard visualization
│   ├── TheoryNotes/
│   ├── ExerciseMode/
│   └── shared/
├── hooks/
└── types/
```

## Roadmap

- [x] Phase 1: Foundation + Root Selector + Mode Toggle
- [ ] Phase 2: Harmonic Field + Chord Cards + Chord Diagrams
- [ ] Phase 3: Scale Explorer + Fretboard Visualization
- [ ] Phase 4: Theory Notes
- [ ] Phase 5: Audio Engine (Tone.js)
- [ ] Phase 6: Exercise Mode
