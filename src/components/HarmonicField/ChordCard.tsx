import { useState } from 'react';
import { CHORD_DATABASE } from '../../data/chords';
import type { HarmonicFieldDegree } from '../../types/music';
import PlayButton from '../shared/PlayButton/PlayButton';
import VoicingNav from '../shared/VoicingNav/VoicingNav';
import ChordDiagram from './ChordDiagram';

interface ChordCardProps {
  degree: HarmonicFieldDegree;
  active?: boolean;
}

const ChordCard = ({ degree, active = false }: ChordCardProps) => {
  const voicings = CHORD_DATABASE[degree.chordName] ?? [];
  const [selected, setSelected] = useState({ chordName: degree.chordName, index: 0 });
  const voicingIndex = selected.chordName === degree.chordName ? selected.index : 0;

  const current = voicings[voicingIndex];

  return (
    <div
      className={`min-w-[280px] snap-start p-6 rounded-2xl relative overflow-hidden group ${
        active
          ? 'bg-surface-elevated border-2 border-accent/30'
          : 'bg-surface border border-border/10 hover:bg-surface-elevated transition-colors'
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute top-0 right-0 p-3 text-6xl font-black italic select-none text-text-primary ${
          active ? 'opacity-20' : 'opacity-10'
        }`}
      >
        {degree.numeral}
      </div>

      <span
        className={`font-bold text-sm tracking-widest uppercase ${
          active ? 'text-accent' : 'text-text-secondary'
        }`}
      >
        {degree.numeral} Degree
      </span>
      <h3 className="text-4xl font-black font-mono mt-1 mb-6">
        {degree.displayName}
      </h3>

      <div className="bg-surface-lowest/50 p-4 rounded-xl mb-6 flex justify-center min-h-[180px]">
        {current ? (
          <ChordDiagram voicing={current} chordName={degree.displayName} />
        ) : (
          <span className="text-text-muted text-xs self-center">
            No voicing available
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <VoicingNav
          current={voicingIndex}
          total={voicings.length || 1}
          onChange={(i) => setSelected({ chordName: degree.chordName, index: i })}
        />
        <PlayButton disabled ariaLabel={`Play ${degree.displayName}`} />
      </div>
    </div>
  );
};

export default ChordCard;
