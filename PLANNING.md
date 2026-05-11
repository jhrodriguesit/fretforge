# PLANNING.md

## What is FretForge?
An editorial, reference-style web app for guitar players to study music theory through harmonic fields and scale patterns. The product is a quick reference, not a course — pick a key/scale, see the chords or shapes, move on.

## Tech Stack
- React 19 + TypeScript (strict)
- Vite
- Tailwind CSS v4 (CSS-first `@theme`)
- Vitest + React Testing Library
- Tone.js (audio, Phase 5+)
- GitHub Actions CI → GitHub Pages

## Routing
Hash-based, no library. `useHashRoute()` listens for `hashchange` and returns the route segment. `navTo(path)` mutates `location.hash`. Routes:
- `#/` → Landing
- `#/harmony` → HarmonyView
- `#/scales` → ScalesView (includes TheoryNotes inline)

## Music Theory Reference
See `/docs/music-theory-reference.md` for harmonic fields and theory tables — the source of truth for theory decisions.

## Design System

Editorial paper theme (replaces the original dark theme).

### Colors
| Token | Value | Use |
|-------|-------|-----|
| `--color-paper` | `#f4efe6` | Page background |
| `--color-paper-2` | `#ece5d6` | Card backgrounds, sub-panels |
| `--color-rule` | `#d9cfbb` | Borders, hairlines |
| `--color-ink` | `#1a1714` | Primary text, fretboard lines, scale-tone dots |
| `--color-ink-2` | `#5a4e42` | Secondary text, mono tags |
| `--color-accent` | `oklch(0.62 0.14 40)` | Rust — root note, tonic, active nav |
| `--color-brass` | `oklch(0.72 0.09 85)` | Blue-note (♭5) accent |

### Radii
`--radius-sm: 8px` · `--radius-md: 14px` · `--radius-lg: 22px` · `--radius-pill: 999px`

### Typography
- **Instrument Serif** — display headlines, chord names in cards, serif wordmark. Italic + accent color for emphasis fragments ("the harmonic field _of C major._").
- **Inter** — body text (`font-sans`).
- **JetBrains Mono** — section tags (`<TagLabel>`), fret labels, CTA buttons (uppercase, ~0.18em tracking).

### Component Patterns
- **Section labels** — `<TagLabel>`: 10px mono, 0.28em tracking, uppercase, ink-2.
- **Note pill picker (`RootSelector`)** — 44px circles, ink border, transparent fill; ink fill + paper text when selected; Instrument Serif numerals.
- **Chip group (`ChipGroup`, `ScaleModeToggle`)** — same border/fill pattern, mono-caps text.
- **Cards** — `1px solid --color-rule`, paper background, `--radius-md`. Tonic chord card emphasizes I in rust.
- **Buttons (`ForgeButton`)** — black ink pill, paper text, mono caps with optional → arrow. Variants: `primary`, `ghost` (outlined), `accent` (rust fill).
- **Wordmark** — ink-filled rounded tile with italic serif "F" + serif "FretForge".

### Chord Diagram Style (vertical, used on Harmony chord cards)
- 6 vertical lines = strings (low E on left → high e on right).
- 4–5 horizontal lines = frets.
- Thick top bar = nut (or thin line + base-fret label `Nª` when position > 1).
- Filled ink circles = fingered notes.
- "X" above nut = muted strings; outlined circle above nut = open strings.
- Optional barre rendered as a thick line spanning fretted strings.

### Fretboard Visualization (horizontal, used on Scales view)
- Strings horizontal — low E at the bottom, high E at the top.
- Frets vertical, always exactly 5 frets visible per shape.
- Optional open-string column to the left of the nut, drawn only when the shape includes fret 0. Open-string scale tones render as outlined circles (paper fill, ink stroke).
- Thick nut bar when `startFret === 1`; thin fret line + numeric label below otherwise.
- Note dots: rust fill for root, brass fill for blue note (♭5 in blues), ink fill for other scale tones. Note name (key-aware spelling) rendered inside each dot in paper color.
- Five shapes are computed by wrapping any natural start above fret 12 down by 12, then sorting ascending so Shape 1 is the lowest position on the neck. This spreads positions across the whole fretboard for any root.

## Project Structure
```
src/
├── App.tsx                  # Hash router → Landing / HarmonyView / ScalesView
├── main.tsx
├── index.css                # Tailwind @theme + radius vars + .serif utility
├── hooks/
│   └── useHashRoute.ts      # hashchange hook + navTo()
├── data/                    # Pure music-theory data
│   ├── notes.ts
│   ├── intervals.ts
│   ├── noteNames.ts
│   ├── keySignatures.ts
│   ├── harmonicField.ts
│   ├── chords.ts            # CHORD_DATABASE: voicings per chord name
│   └── scales.ts            # ScaleType, SCALE_INTERVALS, CAGED_SHAPES
├── utils/
│   ├── musicTheory.ts       # getHarmonicField, getKeySignature, getRelativeKey, getIntervalPattern
│   ├── guitarUtils.ts       # getScalePositions, getScalePositionsInRange, rootFretOnLowE, getNoteAtFret
│   └── audioEngine.ts       # Tone.Sampler wrapper — load/play/subscribe, NO tests
├── types/music.ts           # Note, ScaleMode, ChordVoicing, HarmonicFieldDegree
├── views/
│   ├── HarmonyView.tsx
│   └── ScalesView.tsx
└── components/              # Feature folders: Name/Name.tsx + Name.test.tsx
    ├── Header/              # AppNav (Wordmark + nav links, active accent)
    ├── Landing/             # Hero + section cards + how-to-use + footer
    ├── RootSelector/
    ├── ScaleModeToggle/
    ├── HarmonicField/       # HarmonicField, ChordCard, ChordDiagram
    ├── ScaleExplorer/
    │   └── CompactFretboard.tsx   # Horizontal 5-fret SVG with optional open column
    ├── TheoryNotes/
    └── shared/
        ├── Wordmark/
        ├── ForgeButton/
        ├── TagLabel/
        ├── ChipGroup/
        ├── PlayButton/      # rust pill with play/loading/unavailable states (Phase 5)
        └── VoicingNav/
```

## Conventions
- Co-located tests: every file gets a `.test.ts(x)` in the same folder.
- Exception: no tests for audio files (`audioEngine.ts`, future `useAudio.ts`).
- Components use feature folders: `ComponentName/ComponentName.tsx` + `ComponentName.test.tsx`.
- All music theory logic lives in `data/` and `utils/`, not in components.
- Pure functions preferred — components stay thin.
- Single responsibility: data files export data, utils export functions, components render UI.

### Guitar Standard Tuning
Low → High: E2, A2, D3, G3, B3, E4. String index 0 = low E in our codebase.

## Phases Overview (current status)
- [x] Phase 1: Foundation + Root Selector + Mode Toggle
- [x] Phase 2: Harmonic Field + Chord Cards + Chord Diagrams
- [x] Phase 3: Scale Explorer + Fretboard Visualization
- [x] Phase 4: Theory Notes
- [x] Editorial redesign — paper/ink/rust theme, Landing page, hash routing, horizontal scale fretboards with open-string column, neck-spread shape distribution
- [x] Phase 5: Audio Engine (Tone.js) — nylon guitar Sampler, strum humanization, `useAudio` hook, PlayButton wired up
- [ ] Phase 6: Practice / Ear Training Mode
