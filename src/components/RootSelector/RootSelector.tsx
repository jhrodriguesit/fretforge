import { CHROMATIC_NOTES, type Note } from '../../data/notes';
import { getKeySpelling } from '../../data/keySignatures';
import type { ScaleMode } from '../../types/music';

interface RootSelectorProps {
  selectedRoot: Note;
  mode: ScaleMode;
  onRootChange: (note: Note) => void;
}

const RootSelector = ({ selectedRoot, mode, onRootChange }: RootSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CHROMATIC_NOTES.map((note) => {
        const isSelected = note === selectedRoot;
        const label = getKeySpelling(note, mode)[0];
        return (
          <button
            key={note}
            type="button"
            onClick={() => onRootChange(note)}
            aria-pressed={isSelected}
            aria-label={label}
            className="cursor-pointer transition-[filter] hover:brightness-95"
            style={{
              minWidth: 44,
              padding: '10px 0',
              border: '1px solid var(--color-ink)',
              background: isSelected ? 'var(--color-ink)' : 'transparent',
              color: isSelected ? 'var(--color-paper)' : 'var(--color-ink)',
              fontFamily: 'Instrument Serif, Georgia, serif',
              fontSize: 20,
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default RootSelector;
