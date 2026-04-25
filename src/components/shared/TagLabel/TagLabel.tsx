import type { ReactNode } from 'react';

interface TagLabelProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

const TagLabel = ({ children, color, className = '' }: TagLabelProps) => (
  <div
    className={`font-mono uppercase ${className}`}
    style={{
      fontSize: 10,
      letterSpacing: '0.28em',
      color: color ?? 'var(--color-ink-2)',
    }}
  >
    {children}
  </div>
);

export default TagLabel;
