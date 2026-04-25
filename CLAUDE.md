# FretForge

Editorial-style guitar music theory web app — harmonic fields, scales, theory notes. Reference, not a course.

## Commands

```bash
npm run dev      # Dev server
npm run build    # Type-check + build
npm run test     # Tests (watch). Use `-- --run` for single run
npm run lint     # ESLint
```

## Structure

```
src/
├── App.tsx                  # Hash router → Landing / HarmonyView / ScalesView
├── index.css                # Tailwind @theme + :root radius vars + .serif utility
├── hooks/
│   └── useHashRoute.ts      # tiny hashchange hook + navTo(path)
├── data/                    # Pure music-theory data
│   ├── notes.ts             # CHROMATIC_NOTES + Note type
│   ├── intervals.ts
│   ├── noteNames.ts         # Enharmonic spelling helpers
│   ├── keySignatures.ts     # Key → sharps/flats
│   ├── harmonicField.ts     # NUMERALS_BY_MODE, QUALITIES_BY_MODE
│   ├── chords.ts            # CHORD_DATABASE: voicings per chord name
│   └── scales.ts            # ScaleType, SCALE_INTERVALS, CAGED_SHAPES
├── utils/
│   ├── musicTheory.ts       # getHarmonicField, getKeySignature, getRelativeKey, getIntervalPattern
│   └── guitarUtils.ts       # getScalePositions, getScalePositionsInRange, rootFretOnLowE, getNoteAtFret
├── types/music.ts           # Note, ScaleMode, ChordVoicing, HarmonicFieldDegree
├── views/
│   ├── HarmonyView.tsx      # Page header + RootSelector + ScaleModeToggle + HarmonicField
│   └── ScalesView.tsx       # Page header + RootSelector + ChipGroup + 5-shape grid + TheoryNotes
└── components/              # Feature folders: Name/Name.tsx + Name.test.tsx
    ├── Header/              # AppNav: Wordmark + nav links, accent on active
    ├── Landing/             # Hero, section cards, how-to-use, footer
    ├── RootSelector/        # 12-note pill picker, Instrument Serif numerals
    ├── ScaleModeToggle/     # Major/Minor mono-caps chips
    ├── HarmonicField/       # HarmonicField (4-col grid + progressions cell), ChordCard, ChordDiagram (vertical SVG)
    ├── ScaleExplorer/
    │   └── CompactFretboard.tsx  # Horizontal SVG, always 5 frets, optional open column when shape touches fret 0
    ├── TheoryNotes/         # Interval pattern + relative key cards
    └── shared/
        ├── Wordmark/        # LogoMark (ink tile + italic F) + serif wordmark
        ├── ForgeButton/     # Black pill, mono caps, primary/ghost/accent
        ├── TagLabel/        # Mono uppercase section tag
        ├── ChipGroup/       # Generic mono-caps chip selector
        ├── PlayButton/      # Disabled until Phase 5
        └── VoicingNav/      # Cycle voicings per chord card
```

## Current Status

- Phase 1 ✓ Foundation, RootSelector, ScaleModeToggle
- Phase 2 ✓ HarmonicField with ChordCards, vertical SVG ChordDiagram (multi-voicing, barre, base-fret label for positions > 1)
- Phase 3 ✓ Scale rendering with 5 CAGED-style shapes; key-aware enharmonic spelling (Bb in D minor, not A#)
- Phase 4 ✓ TheoryNotes: interval pattern + key signature + relative major/minor
- Editorial redesign ✓ Paper/ink/rust theme, Landing page + hash routing (`#/`, `#/harmony`, `#/scales`), horizontal scales fretboards with open-string column, neck-spread shape distribution
- Phase 5+ not started (Audio, Practice/Ear-training Mode)

## Routing

`useHashRoute()` in `src/hooks/useHashRoute.ts` listens for `hashchange` and returns the segment after `#/`. `navTo(path)` mutates `location.hash`. App.tsx switches on the route and renders Header + the matching view. Refresh-safe; back/forward works natively.

## Scale shape computation (key invariant)

`ScalesView` derives 5 shape windows by:
1. For each `CAGED_SHAPES` offset, compute `start = rootFret + offset`.
2. Wrap any `start > 12` down by subtracting 12 (so shapes don't all cluster above fret 12 for higher roots).
3. Clamp negative starts to 0.
4. Sort the 5 starts ascending → Shape 1 is always the lowest neck position.
5. If `start === 0`, render with `startFret = 1` and `showOpen = true` so open-string scale tones appear left of the nut.

Positions inside each window come from `getScalePositionsInRange(root, scaleType, startFret, endFret)` in `utils/guitarUtils.ts`. The older `getScalePositions(root, scaleType, shape)` still exists as a thin wrapper.

## Conventions

- Co-located tests in feature folders.
- Music theory logic in `data/` and `utils/`, not components.
- TypeScript strict, no `any`.
- Tailwind v4 CSS-first config (`@theme` in `index.css`).
- Fonts: Instrument Serif (`.serif`), Inter (`font-sans`), JetBrains Mono (`font-mono`).
- All interactive elements use `cursor-pointer`.

## Design Tokens (in `src/index.css`)

`paper` #f4efe6 · `paper-2` #ece5d6 · `rule` #d9cfbb
`ink` #1a1714 · `ink-2` #5a4e42
`accent` oklch(0.62 0.14 40) (rust) · `brass` oklch(0.72 0.09 85)
Radius vars: `--radius-sm: 8px` · `--radius-md: 14px` · `--radius-lg: 22px` · `--radius-pill: 999px`
Fonts: `Instrument Serif` (display, `.serif`), `Inter` (body, `font-sans`), `JetBrains Mono` (tags/code, `font-mono`)

## Key Patterns

- Section labels: `<TagLabel>` (mono, 10px, 0.28em tracking, uppercase, `var(--color-ink-2)`).
- Selected pill button (RootSelector): `border: 1px solid ink`, ink fill + paper text when active, Instrument Serif numerals.
- Active chip (ChipGroup, ScaleModeToggle): same pattern, mono caps text.
- Cards: `border: 1px solid var(--color-rule); background: var(--color-paper); border-radius: var(--radius-md)`.
- Tonic emphasis in Harmony: roman + chord name in `var(--color-accent)`.
- Italic + accent fragments in serif headlines (`<span style="font-style: italic; color: var(--color-accent)">`).
- Horizontal scale fretboard convention: low E at bottom, high E at top, frets vertical, fret numbers below the lowest string.

## References

- Music Theory: `/docs/music-theory-reference.md`
- Full spec: `PLANNING.md`
