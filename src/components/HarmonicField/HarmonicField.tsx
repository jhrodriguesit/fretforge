import { useMemo } from 'react';
import type { Note } from '../../data/notes';
import type { ScaleMode } from '../../types/music';
import { getHarmonicField } from '../../utils/musicTheory';
import ChordCard from './ChordCard';
import ProgressionsPicker from './ProgressionsPicker';

interface HarmonicFieldProps {
  selectedRoot: Note;
  scaleMode: ScaleMode;
}

const HarmonicField = ({ selectedRoot, scaleMode }: HarmonicFieldProps) => {
  const degrees = useMemo(
    () => getHarmonicField(selectedRoot, scaleMode),
    [selectedRoot, scaleMode],
  );

  const numeralToDegree = useMemo(() => {
    const map = new Map<string, (typeof degrees)[number]>();
    for (const d of degrees) map.set(d.numeral, d);
    return map;
  }, [degrees]);

  return (
    <section className="flex flex-col gap-4">
      <div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        data-testid="harmonic-field-grid"
      >
        {degrees.map((degree) => (
          <ChordCard
            key={`${degree.numeral}-${degree.chordName}`}
            degree={degree}
            active={degree.degree === 1}
          />
        ))}
      </div>

      <ProgressionsPicker
        scaleMode={scaleMode}
        numeralToDegree={numeralToDegree}
      />
    </section>
  );
};

export default HarmonicField;
