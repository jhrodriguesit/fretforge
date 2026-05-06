import { useState } from 'react';
import { CHORD_DATABASE } from '../../data/chords';
import type { HarmonicFieldDegree } from '../../types/music';
import { useAudio } from '../../hooks/useAudio';
import { voicingToPitches } from '../../utils/guitarUtils';
import PlayButton from '../shared/PlayButton/PlayButton';
import VoicingNav from '../shared/VoicingNav/VoicingNav';
import ChordDiagram from './ChordDiagram';

interface ChordCardProps {
  degree: HarmonicFieldDegree;
  active?: boolean;
}

const FUNCTION_LABEL: Record<number, string> = {
  1: 'Tonic',
  2: 'Supertonic',
  3: 'Mediant',
  4: 'Subdominant',
  5: 'Dominant',
  6: 'Submediant',
  7: 'Leading',
};

const ChordCard = ({ degree, active = false }: ChordCardProps) => {
  const voicings = CHORD_DATABASE[degree.chordName] ?? [];
  const [selected, setSelected] = useState({
    chordName: degree.chordName,
    index: 0,
  });
  const voicingIndex =
    selected.chordName === degree.chordName ? selected.index : 0;
  const current = voicings[voicingIndex];

  const accentColor = active ? 'var(--color-accent)' : 'var(--color-ink-2)';
  const headingColor = active ? 'var(--color-accent)' : 'var(--color-ink)';

  const { playChord, isLoading, isFailed } = useAudio();
  const handlePlay = () => {
    if (current) playChord(voicingToPitches(current));
  };

  return (
    <div
      style={{
        border: '1px solid var(--color-rule)',
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius-md)',
        padding: 18,
      }}
    >
      <div className="flex justify-between items-baseline">
        <div>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              color: accentColor,
            }}
          >
            {degree.numeral}
          </div>
          <div
            className="serif mt-0.5"
            style={{
              fontSize: 40,
              lineHeight: 1,
              color: headingColor,
            }}
          >
            {degree.displayName}
          </div>
        </div>
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 9,
            letterSpacing: '0.18em',
            color: 'var(--color-ink-2)',
          }}
        >
          {FUNCTION_LABEL[degree.degree]}
        </div>
      </div>

      <div className="mt-3.5 flex justify-center">
        {current ? (
          <ChordDiagram voicing={current} chordName={degree.displayName} />
        ) : (
          <span
            className="text-xs self-center"
            style={{ color: 'var(--color-ink-2)' }}
          >
            No voicing available
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 min-h-9">
        {voicings.length > 1 ? (
          <VoicingNav
            current={voicingIndex}
            total={voicings.length}
            onChange={(i) =>
              setSelected({ chordName: degree.chordName, index: i })
            }
          />
        ) : (
          <span />
        )}
        <PlayButton
          onClick={handlePlay}
          disabled={!current}
          loading={isLoading}
          unavailable={isFailed}
          ariaLabel={`Play ${degree.displayName} chord`}
        />
      </div>
    </div>
  );
};

export default ChordCard;
