interface PlayButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const PlayButton = ({
  onClick,
  disabled = false,
  ariaLabel = 'Play chord',
}: PlayButtonProps) => {
  const enabledStyle = {
    border: '1px solid var(--color-ink)',
    background: 'var(--color-accent)',
    color: 'var(--color-paper)',
  };
  const disabledStyle = {
    border: '1px solid var(--color-rule)',
    background: 'var(--color-paper-2)',
    color: 'var(--color-ink-2)',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-[filter] ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-95'
      }`}
      style={disabled ? disabledStyle : enabledStyle}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
};

export default PlayButton;
