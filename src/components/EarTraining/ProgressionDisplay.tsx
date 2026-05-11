import PlayButton from '../shared/PlayButton/PlayButton';

interface ProgressionDisplayProps {
  displayNames: string[];
  playingIndex: number | null;
  onPlay: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  isFailed: boolean;
}

const ProgressionDisplay = ({
  displayNames,
  playingIndex,
  onPlay,
  isPlaying,
  isLoading,
  isFailed,
}: ProgressionDisplayProps) => (
  <div className="flex flex-col items-center gap-5">
    <div
      className="flex items-baseline justify-center flex-wrap gap-x-8 gap-y-3"
      aria-label="Chord progression"
    >
      {displayNames.map((name, i) => {
        const active = playingIndex === i;
        return (
          <span
            key={`${i}-${name}`}
            className="serif transition-colors"
            style={{
              fontSize: 48,
              lineHeight: 1,
              color: active ? 'var(--color-accent)' : 'var(--color-ink)',
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
    <PlayButton
      onClick={onPlay}
      disabled={isPlaying}
      loading={isLoading}
      unavailable={isFailed}
      ariaLabel="Play progression"
    />
  </div>
);

export default ProgressionDisplay;
