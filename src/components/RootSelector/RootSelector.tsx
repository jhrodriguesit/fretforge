import { CHROMATIC_NOTES, type Note } from "../../data/notes";

interface RootSelectorProps {
  selectedRoot: Note;
  onRootChange: (note: Note) => void;
}

const RootSelector = ({ selectedRoot, onRootChange }: RootSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {CHROMATIC_NOTES.map((note) => {
        const isSelected = note === selectedRoot;
        return (
          <button
            key={note}
            onClick={() => onRootChange(note)}
            aria-pressed={isSelected}
            className={`w-14 h-14 rounded-full flex items-center justify-center font-mono transition-all active:scale-95 cursor-pointer ${
              isSelected
                ? "bg-accent text-accent-text font-black scale-110 shadow-lg shadow-accent-glow ring-4 ring-accent/20"
                : "bg-surface-low text-text-primary font-bold border border-border/10 hover:bg-surface-elevated"
            }`}
          >
            {note}
          </button>
        );
      })}
    </div>
  );
};

export default RootSelector;
