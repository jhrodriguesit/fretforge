import { useMemo, useState } from 'react';
import type { Note } from '../../types/music';
import {
  CAGED_SHAPES,
  SCALE_DISPLAY_NAMES,
  SCALE_TAB_LABELS,
  type ScaleTab,
  type ScaleType,
} from '../../data/scales';
import { getFretRange, getScalePositions } from '../../utils/guitarUtils';
import Fretboard from './Fretboard';

interface ScaleExplorerProps {
  selectedRoot: Note;
}

const TABS: ScaleTab[] = [
  'major',
  'minor',
  'majorPentatonic',
  'minorPentatonic',
  'blues',
];

const ScaleExplorer = ({ selectedRoot }: ScaleExplorerProps) => {
  const [tab, setTab] = useState<ScaleTab>('major');
  const [shapeId, setShapeId] = useState<number>(1);

  const scaleType: ScaleType = tab === 'blues' ? 'minorBlues' : tab;
  const shape = CAGED_SHAPES.find((s) => s.id === shapeId) ?? CAGED_SHAPES[0];

  const positions = useMemo(
    () => getScalePositions(selectedRoot, scaleType, shape),
    [selectedRoot, scaleType, shape],
  );

  const { startFret, endFret } = useMemo(
    () => getFretRange(shape, selectedRoot),
    [shape, selectedRoot],
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            Scale Explorer
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {selectedRoot} {SCALE_DISPLAY_NAMES[scaleType]} Patterns
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap bg-surface-lowest rounded-lg p-1 border border-border/10">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                  tab === t
                    ? 'bg-surface-elevated text-accent font-bold shadow-sm'
                    : 'text-text-secondary font-medium hover:text-text-primary'
                }`}
              >
                {SCALE_TAB_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary mr-2">
              Shape
            </span>
            <div className="flex gap-1">
              {CAGED_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShapeId(s.id)}
                  aria-label={`Shape ${s.id}`}
                  data-active={shapeId === s.id}
                  className={`w-8 h-8 rounded font-bold text-sm transition-colors cursor-pointer ${
                    shapeId === s.id
                      ? 'bg-accent text-accent-text shadow-md'
                      : 'bg-surface-low text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-3xl p-6 md:p-8 border border-border/10 overflow-x-auto scrollbar-hidden shadow-2xl">
        <div className="min-w-[780px]">
          <Fretboard
            positions={positions}
            startFret={startFret}
            endFret={endFret}
          />
        </div>
      </div>
    </section>
  );
};

export default ScaleExplorer;
