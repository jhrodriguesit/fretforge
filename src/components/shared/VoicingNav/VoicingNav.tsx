interface VoicingNavProps {
  current: number;
  total: number;
  onChange: (index: number) => void;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
  </svg>
);

const VoicingNav = ({ current, total, onChange }: VoicingNavProps) => {
  const prev = () => onChange((current - 1 + total) % total);
  const next = () => onChange((current + 1) % total);
  const showArrows = total > 1;

  return (
    <div className="flex items-center gap-3">
      {showArrows && (
        <button
          type="button"
          onClick={prev}
          aria-label="Previous voicing"
          className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
        >
          <ChevronLeft />
        </button>
      )}
      <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
        Voicing {current + 1} of {total}
      </span>
      {showArrows && (
        <button
          type="button"
          onClick={next}
          aria-label="Next voicing"
          className="text-text-secondary hover:text-accent transition-colors cursor-pointer"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default VoicingNav;
