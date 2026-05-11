interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
  onReset: () => void;
}

const StreakBadge = ({ streak, bestStreak, onReset }: StreakBadgeProps) => (
  <div
    className="inline-flex items-center gap-4 font-mono uppercase"
    style={{
      fontSize: 10,
      letterSpacing: '0.22em',
      color: 'var(--color-ink-2)',
    }}
  >
    <span>
      Streak{' '}
      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
        {streak}
      </span>
    </span>
    <span style={{ color: 'var(--color-rule)' }}>·</span>
    <span>
      Best{' '}
      <span style={{ color: 'var(--color-ink)' }}>{bestStreak}</span>
    </span>
    <button
      type="button"
      onClick={onReset}
      className="cursor-pointer bg-transparent border-0 p-0 hover:brightness-90"
      style={{
        fontSize: 9,
        letterSpacing: '0.22em',
        color: 'var(--color-ink-2)',
        textDecoration: 'underline',
        textUnderlineOffset: 3,
      }}
    >
      Reset
    </button>
  </div>
);

export default StreakBadge;
