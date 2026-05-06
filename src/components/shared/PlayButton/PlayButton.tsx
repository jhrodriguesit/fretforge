interface PlayButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  unavailable?: boolean;
  ariaLabel?: string;
}

const PlayButton = ({
  onClick,
  disabled = false,
  loading = false,
  unavailable = false,
  ariaLabel = 'Play chord',
}: PlayButtonProps) => {
  const inactive = disabled || loading || unavailable;

  const enabledStyle = {
    border: '1px solid var(--color-ink)',
    background: 'var(--color-accent)',
    color: 'var(--color-paper)',
  };
  const inactiveStyle = {
    border: '1px solid var(--color-rule)',
    background: 'var(--color-paper-2)',
    color: 'var(--color-ink-2)',
  };

  const showLabel = unavailable || loading;
  const sizeClass = showLabel
    ? 'h-9 px-2.5 rounded-full'
    : 'w-9 h-9 rounded-full';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={inactive}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={`${sizeClass} flex items-center justify-center transition-[filter] ${
        inactive ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-95'
      }`}
      style={inactive ? inactiveStyle : enabledStyle}
    >
      {showLabel ? (
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: '0.18em' }}
        >
          {unavailable ? 'Unavailable' : 'Loading'}
        </span>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="currentColor"
          aria-hidden="true"
          style={{ opacity: disabled ? 0.5 : 1 }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
};

export default PlayButton;
