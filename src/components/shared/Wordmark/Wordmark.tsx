interface WordmarkProps {
  size?: number;
  fontSize?: number;
  showText?: boolean;
}

export const LogoMark = ({ size = 24 }: { size?: number }) => {
  const r = Math.max(2, size / 6);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <rect width={size} height={size} fill="var(--color-ink)" rx={r} />
      <text
        x={size / 2}
        y={size * 0.78}
        textAnchor="middle"
        fontFamily="Instrument Serif"
        fontStyle="italic"
        fontSize={size * 0.78}
        fill="var(--color-paper)"
      >
        F
      </text>
    </svg>
  );
};

const Wordmark = ({ size = 26, fontSize = 26, showText = true }: WordmarkProps) => (
  <span className="inline-flex items-center gap-2.5">
    <LogoMark size={size} />
    {showText && (
      <span className="serif leading-none" style={{ fontSize }}>
        FretForge
      </span>
    )}
  </span>
);

export default Wordmark;
