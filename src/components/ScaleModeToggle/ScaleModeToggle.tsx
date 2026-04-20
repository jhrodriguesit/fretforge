import type { ScaleMode } from '../../types/music';

interface ScaleModeToggleProps {
  mode: ScaleMode;
  onModeChange: (mode: ScaleMode) => void;
}

const ScaleModeToggle = ({ mode, onModeChange }: ScaleModeToggleProps) => {
  return (
    <div className="flex p-1 bg-surface-lowest rounded-xl gap-1 border border-border/10 max-w-md">
      <button
        onClick={() => onModeChange('major')}
        className={`flex-1 py-3 px-4 rounded-lg transition-all cursor-pointer ${
          mode === 'major'
            ? 'bg-accent text-accent-text font-bold'
            : 'text-text-secondary font-medium hover:text-text-primary'
        }`}
      >
        Major
      </button>
      <button
        onClick={() => onModeChange('minor')}
        className={`flex-1 py-3 px-4 rounded-lg transition-all cursor-pointer ${
          mode === 'minor'
            ? 'bg-accent text-accent-text font-bold'
            : 'text-text-secondary font-medium hover:text-text-primary'
        }`}
      >
        Minor
      </button>
    </div>
  );
};

export default ScaleModeToggle;
