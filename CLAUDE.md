# Fretforge

Guitar music theory web app — harmonic fields, scales, ear training.

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
├── App.tsx              # Root state: selectedRoot (Note), scaleMode (ScaleMode)
├── index.css            # Tailwind @theme — all design tokens
├── data/notes.ts        # CHROMATIC_NOTES array + Note type
├── types/music.ts       # ScaleMode type
├── components/          # Feature folders: Name/Name.tsx + Name.test.tsx
│   ├── Header/
│   ├── RootSelector/    # Props: selectedRoot, onRootChange
│   └── ScaleModeToggle/ # Props: mode, onModeChange
```

## Conventions

- Co-located tests in feature folders
- Music theory logic in `data/` and `utils/`, not components
- TypeScript strict, no `any`
- Tailwind v4, CSS-first config (`@theme` in index.css)
- Fonts: JetBrains Mono (`font-mono`) for notes/chords, DM Sans (`font-sans`) for UI
- All interactive elements need `cursor-pointer`

## Design Tokens (in `src/index.css`)

`bg` #0D0D0D · `surface` #1A1A1A · `surface-elevated` #222 · `surface-low` #1C1B1B · `surface-lowest` #0E0E0E
`accent` #F5A623 · `accent-text` #472A00 · `accent-glow` rgba(245,166,35,0.3)
`text-primary` #FFF · `text-secondary` #888 · `text-muted` #555 · `border` #2A2A2A

## Key Patterns

- Section labels: `text-sm font-bold tracking-widest text-text-secondary uppercase`
- Selected note button: `bg-accent text-accent-text font-black scale-110 shadow-lg ring-4 ring-accent/20`
- Active toggle: `bg-accent text-accent-text font-bold`
- Cards (Phase 2+): `bg-surface rounded-2xl border border-border/10 p-6`
- Design reference: `docs/design-reference.html`
- Music Theory Reference: `/docs/music-theory-reference.md`
- Full spec: `PLANNING.md`
