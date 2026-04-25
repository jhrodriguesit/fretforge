import { useMemo } from 'react';
import type { Note } from '../../data/notes';
import type { ScaleMode } from '../../types/music';
import { getHarmonicField } from '../../utils/musicTheory';
import ChordCard from './ChordCard';
import TagLabel from '../shared/TagLabel/TagLabel';

interface HarmonicFieldProps {
  selectedRoot: Note;
  scaleMode: ScaleMode;
}

const PROGRESSIONS_MAJOR: string[][] = [
  ['I', 'V', 'vi', 'IV'],
  ['ii', 'V', 'I'],
  ['I', 'vi', 'IV', 'V'],
];
const PROGRESSIONS_MINOR: string[][] = [
  ['i', '♭VII', '♭VI', 'v'],
  ['i', 'iv', 'v'],
  ['i', '♭VI', '♭III', '♭VII'],
];

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

  const progressions =
    scaleMode === 'major' ? PROGRESSIONS_MAJOR : PROGRESSIONS_MINOR;

  return (
    <section
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

      {/* Progressions cell */}
      <div
        className="flex flex-col justify-center"
        style={{
          border: '1px dashed var(--color-rule)',
          padding: 18,
          background: 'var(--color-paper)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <TagLabel>Progressions to try</TagLabel>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {progressions.map((prog, pi) => (
            <div key={pi} className="flex flex-wrap gap-1.5">
              {prog.map((numeral, ri) => {
                const ch = numeralToDegree.get(numeral);
                return (
                  <span
                    key={ri}
                    className="serif"
                    style={{
                      padding: '6px 10px',
                      background: 'var(--color-paper-2)',
                      fontSize: 18,
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {ch ? ch.displayName : numeral}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HarmonicField;
