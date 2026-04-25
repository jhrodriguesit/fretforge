import { useMemo, useState } from 'react';
import type { Note } from '../data/notes';
import type { ScaleMode } from '../types/music';
import {
  CAGED_SHAPES,
  SCALE_INTERVALS,
  type ScaleTab,
  type ScaleType,
} from '../data/scales';
const SHAPE_OFFSETS = CAGED_SHAPES.map((s) => s.startOffset);
import { getKeySpelling } from '../data/keySignatures';
import { nameToPitchClass, type NoteName } from '../data/noteNames';
import { CHROMATIC_NOTES } from '../data/notes';
import {
  getScalePositionsInRange,
  rootFretOnLowE,
} from '../utils/guitarUtils';
import RootSelector from '../components/RootSelector/RootSelector';
import ChipGroup from '../components/shared/ChipGroup/ChipGroup';
import CompactFretboard from '../components/ScaleExplorer/CompactFretboard';
import TheoryNotes from '../components/TheoryNotes/TheoryNotes';
import TagLabel from '../components/shared/TagLabel/TagLabel';

const SCALE_OPTIONS: Array<[ScaleTab, string]> = [
  ['major', 'Major'],
  ['minor', 'Minor'],
  ['majorPentatonic', 'Major pent.'],
  ['minorPentatonic', 'Minor pent.'],
  ['blues', 'Blues'],
];

const SCALE_TITLE: Record<ScaleTab, string> = {
  major: 'major',
  minor: 'minor',
  majorPentatonic: 'major pentatonic',
  minorPentatonic: 'minor pentatonic',
  blues: 'blues',
};

const SCALE_DEGREES: Record<ScaleType, string[]> = {
  major: ['1', '2', '3', '4', '5', '6', '7'],
  minor: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
  majorPentatonic: ['1', '2', '3', '5', '6'],
  minorPentatonic: ['1', '♭3', '4', '5', '♭7'],
  minorBlues: ['1', '♭3', '4', '♭5', '5', '♭7'],
};

const tabToType = (tab: ScaleTab): ScaleType =>
  tab === 'blues' ? 'minorBlues' : tab;

const tabToMode = (tab: ScaleTab): ScaleMode =>
  tab === 'major' || tab === 'majorPentatonic' ? 'major' : 'minor';

const flatOfFifth = (fifth: NoteName): NoteName =>
  fifth.endsWith('#')
    ? (fifth.slice(0, -1) as NoteName)
    : (`${fifth}b` as NoteName);

const buildScaleNoteNames = (root: Note, type: ScaleType): NoteName[] => {
  const mode: ScaleMode =
    type === 'major' || type === 'majorPentatonic' ? 'major' : 'minor';
  const fullSpelling = getKeySpelling(root, mode);
  const rootPc = CHROMATIC_NOTES.indexOf(root);
  const intervals = SCALE_INTERVALS[type];

  const pcToName = new Map<number, NoteName>();
  for (const name of fullSpelling) {
    pcToName.set(CHROMATIC_NOTES.indexOf(nameToPitchClass(name)), name);
  }
  if (type === 'minorBlues') {
    const flatFive = flatOfFifth(fullSpelling[4]);
    pcToName.set(CHROMATIC_NOTES.indexOf(nameToPitchClass(flatFive)), flatFive);
  }

  return intervals.map((i) => {
    const pc = (rootPc + i) % 12;
    return pcToName.get(pc) ?? (CHROMATIC_NOTES[pc] as NoteName);
  });
};

const ScalesView = () => {
  const [root, setRoot] = useState<Note>('A');
  const [tab, setTab] = useState<ScaleTab>('minorPentatonic');
  const scaleType = tabToType(tab);
  const scaleMode = tabToMode(tab);

  const noteNames = useMemo(
    () => buildScaleNoteNames(root, scaleType),
    [root, scaleType],
  );
  const degrees = SCALE_DEGREES[scaleType];

  const shapes = useMemo(() => {
    const rootFret = rootFretOnLowE(root);
    // Compute each shape's natural start, wrapping high positions into the
    // lower neck so the 5 shapes spread across the whole fretboard.
    const rawStarts = SHAPE_OFFSETS.map((offset) => {
      let s = rootFret + offset;
      if (s < 0) s = 0;
      while (s > 12) s -= 12;
      return s;
    });
    return [...rawStarts]
      .sort((a, b) => a - b)
      .map((s, idx) => {
        const showOpen = s === 0;
        const startFret = showOpen ? 1 : s;
        const queryStart = showOpen ? 0 : startFret;
        const endFret = startFret + 4;
        const positions = getScalePositionsInRange(
          root,
          scaleType,
          queryStart,
          endFret,
        );
        return { id: idx + 1, startFret, showOpen, positions };
      });
  }, [root, scaleType]);

  return (
    <div style={{ background: 'var(--color-paper)' }} className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-12 pb-8">
        <TagLabel>02 · Scales</TagLabel>
        <h1
          className="serif mt-2.5 text-4xl sm:text-5xl md:text-[56px]"
          style={{ lineHeight: 0.98, letterSpacing: '-0.01em' }}
        >
          <span style={{ color: 'var(--color-accent)' }}>{root}</span>{' '}
          {SCALE_TITLE[tab]}{' '}
          <span style={{ fontStyle: 'italic' }}>— five shapes.</span>
        </h1>
        <p
          className="mt-3.5 max-w-[560px]"
          style={{
            fontSize: 14,
            color: 'var(--color-ink-2)',
            lineHeight: 1.6,
          }}
        >
          The same scale, mapped in five positions across the neck. Learn one,
          then connect them.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-8 flex flex-col gap-5">
        <div>
          <TagLabel>Root note</TagLabel>
          <div className="mt-2.5">
            <RootSelector
              selectedRoot={root}
              mode={scaleMode}
              onRootChange={setRoot}
            />
          </div>
        </div>
        <div>
          <TagLabel>Scale</TagLabel>
          <div className="mt-2.5">
            <ChipGroup options={SCALE_OPTIONS} value={tab} onChange={setTab} />
          </div>
        </div>
      </div>

      {/* Notes + degrees strip */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-7">
        <div
          className="flex flex-wrap gap-5 items-center"
          style={{
            padding: '18px 20px',
            background: 'var(--color-paper-2)',
            border: '1px solid var(--color-rule)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            className="flex items-center pr-5"
            style={{ borderRight: '1px solid var(--color-rule)' }}
          >
            <TagLabel>Notes</TagLabel>
          </div>
          {noteNames.map((n, i) => (
            <div key={`${n}-${i}`} className="text-center min-w-[40px]">
              <div
                className="serif"
                style={{
                  fontSize: 24,
                  lineHeight: 1,
                  color:
                    i === 0 ? 'var(--color-accent)' : 'var(--color-ink)',
                }}
              >
                {n}
              </div>
              <div
                className="font-mono mt-1"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.15em',
                  color: 'var(--color-ink-2)',
                }}
              >
                {degrees[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 shapes grid */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-12">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {shapes.map(({ id, startFret, showOpen, positions }) => (
            <div
              key={id}
              style={{
                background: 'var(--color-paper)',
                padding: 16,
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div className="flex justify-between items-baseline">
                <div
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--color-ink-2)',
                  }}
                >
                  Shape {id}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.15em',
                    color: 'var(--color-ink-2)',
                  }}
                >
                  {showOpen ? 'OPEN · FR 1' : `FR ${startFret}`}
                </div>
              </div>
              <div className="mt-3">
                <CompactFretboard
                  positions={positions}
                  startFret={startFret}
                  showOpen={showOpen}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div
          className="flex flex-wrap gap-6 mt-6"
          style={{ fontSize: 12, color: 'var(--color-ink-2)' }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'var(--color-accent)',
              }}
            />
            Root note
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'var(--color-ink)',
              }}
            />
            Scale tone
          </span>
          {scaleType === 'minorBlues' && (
            <span className="inline-flex items-center gap-2">
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'var(--color-brass)',
                }}
              />
              Blue note (♭5)
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <span className="font-mono">FR</span>
            Starting fret of each shape
          </span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-20">
        <TheoryNotes
          selectedRoot={root}
          scaleMode={scaleMode}
          scaleType={scaleType}
        />
      </div>
    </div>
  );
};

export default ScalesView;
