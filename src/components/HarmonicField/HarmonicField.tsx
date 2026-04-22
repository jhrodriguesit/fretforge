import { useMemo, useRef } from 'react';
import type { Note, ScaleMode } from '../../types/music';
import { getHarmonicField } from '../../utils/musicTheory';
import ChordCard from './ChordCard';

interface HarmonicFieldProps {
  selectedRoot: Note;
  scaleMode: ScaleMode;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
  </svg>
);

const HarmonicField = ({ selectedRoot, scaleMode }: HarmonicFieldProps) => {
  const degrees = useMemo(
    () => getHarmonicField(selectedRoot, scaleMode),
    [selectedRoot, scaleMode],
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-text-primary tracking-tight">
          Harmonic Field
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll chords left"
            className="p-2 bg-surface-elevated rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll chords right"
            className="p-2 bg-surface-elevated rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 snap-x"
        data-testid="harmonic-field-scroll"
      >
        {degrees.map((degree) => (
          <ChordCard
            key={`${degree.numeral}-${degree.chordName}`}
            degree={degree}
            active={degree.degree === 1}
          />
        ))}
      </div>
    </section>
  );
};

export default HarmonicField;
