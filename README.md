# FretForge

An interactive web app for guitar players to study music theory through harmonic fields, scale patterns, and ear training exercises.

**Live demo:** [jhrodriguesit.github.io/FretForge](https://jhrodriguesit.github.io/FretForge/)

## Features

- **Root Selector** — pick any of the 12 chromatic notes as the current key.
- **Scale Mode Toggle** — switch between major and minor tonalities for the harmonic field.
- **Harmonic Field** — scrollable cards showing the diatonic chords of the selected key, each with an SVG chord diagram supporting multi-voicing navigation, barre chords, and base-fret labels for higher positions.
- **Scale Explorer** — SVG fretboard with five CAGED-style shapes for major, minor, major/minor pentatonic, and blues (minor pentatonic blues, with the ♭5 "blue note" highlighted).

## Tech Stack

- React 19 + TypeScript (strict)
- Vite
- Tailwind CSS v4 (CSS-first `@theme` config)
- Vitest + React Testing Library
- Deployed to GitHub Pages via GitHub Actions

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
├── data/                  # Pure music theory data (notes, intervals, scales, chords)
├── utils/                 # Pure functions (musicTheory, guitarUtils)
├── types/                 # Shared TypeScript types
└── components/            # Feature folders (Name/Name.tsx + Name.test.tsx)
    ├── Header/
    ├── RootSelector/
    ├── ScaleModeToggle/
    ├── HarmonicField/     # Chord cards + SVG chord diagrams
    ├── ScaleExplorer/     # SVG fretboard with CAGED shapes
    └── shared/            # PlayButton, VoicingNav
```

## Conventions

- Co-located tests in feature folders (`Foo/Foo.tsx` + `Foo/Foo.test.tsx`).
- Music theory logic lives in `data/` and `utils/`, never inside components.
- TypeScript strict mode — no `any`.
- Fonts: JetBrains Mono for notes/chords, DM Sans for UI.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

## Roadmap

- [x] Phase 1: Foundation + Root Selector + Mode Toggle
- [x] Phase 2: Harmonic Field + Chord Cards + Chord Diagrams
- [x] Phase 3: Scale Explorer + Fretboard Visualization
- [ ] Phase 4: Theory Notes
- [ ] Phase 5: Audio Engine (Tone.js)
- [ ] Phase 6: Exercise Mode
