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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
        disabled
          ? 'bg-surface-elevated text-text-secondary cursor-not-allowed'
          : 'bg-accent text-accent-text hover:scale-110 shadow-lg shadow-accent-glow'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06A7.01 7.01 0 0 1 19 12a7.01 7.01 0 0 1-5 6.71v2.06A9 9 0 0 0 21 12a9 9 0 0 0-7-8.77z" />
      </svg>
    </button>
  );
};

export default PlayButton;
