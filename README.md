# FretForge

An editorial, reference-style web app for guitar players to study music theory through harmonic fields and scale patterns. No login, no tracking — just the information you need when you sit down with your guitar.

**Live demo:** [jhrodriguesit.github.io/FretForge](https://jhrodriguesit.github.io/FretForge/)

## Built with Claude

I built FretForge using [Claude Code](https://claude.ai/code) — Anthropic's CLI-based AI development environment — from initial planning through every shipped phase. The repository includes several Claude-specific artifacts that reflect how that workflow operated:

- **`CLAUDE.md`** — A project instruction file loaded automatically into every Claude Code session. It encodes the app architecture, component conventions, design tokens, routing logic, and scale-shape algorithm so every session starts with full context.
- **`PLANNING.md`** — A detailed specification generated with Claude before a single line of code was written. It covers the full feature breakdown, component tree, design system, hash-routing approach, and SVG fretboard rendering spec — used as the authoritative reference throughout all five phases.
- **`.claude/settings.local.json`** — A permission allowlist for `npm`, `git`, and `gh` CLI commands, configured to reduce confirmation prompts during active development and keep the feedback loop tight.
- **`.claude/skills/grill-me`** — A custom slash-command skill (`/grill-me`) that runs structured design interviews, walking down each decision branch one at a time to stress-test plans before implementation begins.

## Features

- **Landing page** with hero, section cards, and "how to use it" guide. Hash-based client-side routing (`#/`, `#/harmony`, `#/scales`) — refresh-safe, no server, no router dependency.
- **Harmony view** — pick a root note + Major/Minor; see the seven diatonic chords as a degree summary row plus a chord-card grid (each with an SVG chord diagram, function label, and the tonic highlighted in rust). A "progressions to try" cell lists common patterns (I-V-vi-IV, ii-V-I, etc.) using the live key.
- **Scales view** — pick a root + scale (major, minor, major/minor pentatonic, blues). Renders the five CAGED-style shapes simultaneously across the neck, each as a horizontal SVG fretboard with:
  - Always 5 frets shown.
  - Open-string scale tones rendered to the left of the nut when the shape sits at the top of the neck.
  - Shapes spread across the entire neck (positions wrap > fret 12 down by 12, then sort ascending so Shape 1 is always the lowest).
  - Note names inside every dot, with key-aware enharmonic spelling (e.g. B♭ in D minor, not A♯).
  - Root in rust, scale tones in ink, blue note (♭5) in brass for the blues scale.
- **Theory Notes** below the Scales grid — interval pattern + key signature card, and a relative major/minor card that shares the same key signature.
- **Audio playback** — each chord card has a play button that strums the voicing using a nylon guitar sampler (Tone.js). Samples load lazily on first interaction; the button shows loading/unavailable states.

## Design System

Editorial paper theme — bone paper background, deep ink text, rust accent.

| Token | Value |
|-------|-------|
| `--color-paper` | `#f4efe6` |
| `--color-paper-2` | `#ece5d6` |
| `--color-rule` | `#d9cfbb` |
| `--color-ink` | `#1a1714` |
| `--color-ink-2` | `#5a4e42` |
| `--color-accent` | `oklch(0.62 0.14 40)` (rust) |
| `--color-brass` | `oklch(0.72 0.09 85)` |

Type system: **Instrument Serif** for headlines (`.serif`, italic accents), **Inter** for body, **JetBrains Mono** for tags / fret labels / CTAs (uppercase, tracked).

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
├── App.tsx                  # Hash router → Landing / HarmonyView / ScalesView
├── index.css                # Tailwind @theme — design tokens + radius vars
├── hooks/
│   └── useHashRoute.ts      # tiny hashchange-listening hook + navTo()
├── data/                    # Pure music-theory data
├── hooks/
│   ├── useHashRoute.ts      # hashchange hook + navTo()
│   └── useAudio.ts          # wraps audioEngine — exposes playChord, isReady/isLoading/isFailed
├── utils/
│   ├── musicTheory.ts       # getHarmonicField(root, mode), getKeySignature, etc.
│   ├── guitarUtils.ts       # getScalePositions, getScalePositionsInRange, rootFretOnLowE
│   └── audioEngine.ts       # Tone.Sampler wrapper — load/play/subscribe, NO tests
├── types/                   # Shared TypeScript types
├── views/
│   ├── HarmonyView.tsx      # Page header + RootSelector + ScaleModeToggle + HarmonicField
│   └── ScalesView.tsx       # Page header + RootPicker + ChipGroup + 5-shape grid + TheoryNotes
└── components/              # Feature folders (Name/Name.tsx + Name.test.tsx)
    ├── Header/              # AppNav with active route accent
    ├── Landing/             # Hero, section cards, how-to-use, footer
    ├── RootSelector/        # 12-note pill picker (Instrument Serif numerals)
    ├── ScaleModeToggle/     # Major/Minor mono-caps chips
    ├── HarmonicField/       # 7-chord grid + progressions cell + ChordCard + ChordDiagram (SVG)
    ├── ScaleExplorer/
    │   └── CompactFretboard.tsx  # Horizontal SVG fretboard, 5 frets, optional open column
    ├── TheoryNotes/         # Interval pattern + relative key info cards
    └── shared/
        ├── Wordmark/        # LogoMark (ink tile + italic F) + serif wordmark
        ├── ForgeButton/     # Black pill, mono caps, primary/ghost/accent variants
        ├── TagLabel/        # Mono uppercase section tag
        ├── ChipGroup/       # Generic mono-caps chip selector
        ├── PlayButton/      # Rust pill — play/loading/unavailable states, wired via useAudio
        └── VoicingNav/      # Cycle voicings per chord card
```

## Conventions

- Co-located tests in feature folders (`Foo/Foo.tsx` + `Foo/Foo.test.tsx`).
- Music theory logic lives in `data/` and `utils/`, never inside components.
- TypeScript strict mode — no `any`.
- All interactive elements use `cursor-pointer`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

## Roadmap

- [x] Phase 1: Foundation + Root Selector + Mode Toggle
- [x] Phase 2: Harmonic Field + Chord Cards + Chord Diagrams
- [x] Phase 3: Scale Explorer + Fretboard Visualization
- [x] Phase 4: Theory Notes
- [x] Editorial redesign — paper/ink/rust theme, Landing page, hash routing, horizontal scale fretboards with open-string column, neck-spread shape distribution
- [x] Phase 5: Audio Engine (Tone.js) — nylon guitar Sampler, strum humanization, `useAudio` hook, PlayButton wired up
- [ ] Phase 6: Practice / Ear Training Mode
