import type { ReactNode, CSSProperties } from 'react';

type Variant = 'primary' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ForgeButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  ariaLabel?: string;
}

const SIZES: Record<Size, { padY: number; padX: number; fs: number }> = {
  sm: { padY: 8, padX: 14, fs: 10 },
  md: { padY: 12, padX: 22, fs: 11 },
  lg: { padY: 14, padX: 26, fs: 12 },
};

const VARIANTS: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: 'var(--color-ink)', fg: 'var(--color-paper)', border: 'none' },
  ghost: {
    bg: 'transparent',
    fg: 'var(--color-ink)',
    border: '1px solid var(--color-ink)',
  },
  accent: { bg: 'var(--color-accent)', fg: '#fff', border: 'none' },
};

const ForgeButton = ({
  children,
  variant = 'primary',
  size = 'md',
  arrow = true,
  onClick,
  disabled = false,
  style,
  ariaLabel,
}: ForgeButtonProps) => {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="cursor-pointer inline-flex items-center gap-2.5 transition-[filter] hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: v.bg,
        color: v.fg,
        border: v.border,
        padding: `${s.padY}px ${s.padX}px`,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: s.fs,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-pill)',
        ...style,
      }}
    >
      {children}
      {arrow && <span>→</span>}
    </button>
  );
};

export default ForgeButton;
