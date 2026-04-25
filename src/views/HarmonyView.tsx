import { useMemo, useState } from 'react';
import type { Note } from '../data/notes';
import type { ScaleMode } from '../types/music';
import { getHarmonicField } from '../utils/musicTheory';
import { getKeySpelling } from '../data/keySignatures';
import RootSelector from '../components/RootSelector/RootSelector';
import ScaleModeToggle from '../components/ScaleModeToggle/ScaleModeToggle';
import HarmonicField from '../components/HarmonicField/HarmonicField';
import TagLabel from '../components/shared/TagLabel/TagLabel';

const FUNCTIONS_MAJ = [
  'Tonic',
  'Supertonic',
  'Mediant',
  'Subdominant',
  'Dominant',
  'Submediant',
  'Leading',
];
const FUNCTIONS_MIN = [
  'Tonic',
  'Supertonic',
  'Mediant',
  'Subdominant',
  'Dominant',
  'Submediant',
  'Subtonic',
];

const modeLabel = (mode: ScaleMode) => (mode === 'major' ? 'major' : 'minor');

const HarmonyView = () => {
  const [root, setRoot] = useState<Note>('C');
  const [mode, setMode] = useState<ScaleMode>('major');
  const field = useMemo(() => getHarmonicField(root, mode), [root, mode]);
  const fns = mode === 'major' ? FUNCTIONS_MAJ : FUNCTIONS_MIN;
  const rootLabel = getKeySpelling(root, mode)[0];

  return (
    <div style={{ background: 'var(--color-paper)' }} className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-12 pb-8">
        <TagLabel>01 · Harmony</TagLabel>
        <h1
          className="serif mt-2.5 text-4xl sm:text-5xl md:text-[56px]"
          style={{ lineHeight: 0.98, letterSpacing: '-0.01em' }}
        >
          The harmonic field{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>
            of {rootLabel} {modeLabel(mode)}.
          </span>
        </h1>
        <p
          className="mt-3.5 max-w-[560px]"
          style={{
            fontSize: 14,
            color: 'var(--color-ink-2)',
            lineHeight: 1.6,
          }}
        >
          Every key has seven chords that naturally belong to it. Pick a root
          and mode to see them.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-8 flex flex-col gap-5">
        <div>
          <TagLabel>Root note</TagLabel>
          <div className="mt-2.5">
            <RootSelector
              selectedRoot={root}
              mode={mode}
              onRootChange={setRoot}
            />
          </div>
        </div>
        <div>
          <TagLabel>Mode</TagLabel>
          <div className="mt-2.5">
            <ScaleModeToggle mode={mode} onModeChange={setMode} />
          </div>
        </div>
      </div>

      {/* Degree summary row */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-6">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
        >
          {field.map((c, i) => {
            const isTonic = i === 0;
            return (
              <div
                key={`${c.numeral}-${c.chordName}`}
                className="text-center"
                style={{
                  background: 'var(--color-paper-2)',
                  padding: '14px 10px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  className="font-mono uppercase"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: isTonic ? 'var(--color-accent)' : 'var(--color-ink-2)',
                  }}
                >
                  {c.numeral}
                </div>
                <div
                  className="serif mt-1"
                  style={{
                    fontSize: 26,
                    color: isTonic ? 'var(--color-accent)' : 'var(--color-ink)',
                  }}
                >
                  {c.displayName}
                </div>
                <div
                  className="mt-1"
                  style={{ fontSize: 10, color: 'var(--color-ink-2)' }}
                >
                  {fns[i]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chord cards grid */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-20">
        <HarmonicField selectedRoot={root} scaleMode={mode} />
      </div>
    </div>
  );
};

export default HarmonyView;
