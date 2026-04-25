import type { FretboardPosition } from '../../utils/guitarUtils';

interface CompactFretboardProps {
  positions: FretboardPosition[];
  startFret: number;
  showOpen?: boolean;
}

const STRINGS = 6;
const VISIBLE_FRETS = 5;

const CompactFretboard = ({
  positions,
  startFret,
  showOpen = false,
}: CompactFretboardProps) => {
  const padX = 12;
  const padTop = 16;
  const padBottom = 22;
  const fretW = 46;
  const stringGap = 22;
  const openColW = showOpen ? 26 : 0;
  const dotR = 11;

  const width = padX + openColW + fretW * VISIBLE_FRETS + padX;
  const height = padTop + stringGap * (STRINGS - 1) + padBottom;

  const nutX = padX + openColW;
  const stringY = (s: number) =>
    padTop + (STRINGS - 1 - s) * stringGap;

  const isNut = startFret === 1;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ display: 'block' }}
      role="img"
      aria-label={`Scale shape starting at fret ${startFret}`}
    >
      {/* Strings */}
      {Array.from({ length: STRINGS }).map((_, i) => (
        <line
          key={`s${i}`}
          x1={nutX}
          x2={nutX + fretW * VISIBLE_FRETS}
          y1={stringY(i)}
          y2={stringY(i)}
          stroke="var(--color-ink)"
          strokeWidth={1}
          opacity={0.85}
        />
      ))}
      {/* Nut (thick when window starts at fret 1) or first fret line */}
      <line
        x1={nutX}
        x2={nutX}
        y1={stringY(STRINGS - 1) - 2}
        y2={stringY(0) + 2}
        stroke="var(--color-ink)"
        strokeWidth={isNut ? 4 : 0.75}
        opacity={isNut ? 1 : 0.55}
      />
      {/* Other fret lines */}
      {Array.from({ length: VISIBLE_FRETS }).map((_, i) => {
        const x = nutX + (i + 1) * fretW;
        return (
          <line
            key={`f${i}`}
            x1={x}
            x2={x}
            y1={stringY(STRINGS - 1) - 2}
            y2={stringY(0) + 2}
            stroke="var(--color-ink)"
            strokeWidth={0.75}
            opacity={0.55}
          />
        );
      })}
      {/* Fret number labels below */}
      {Array.from({ length: VISIBLE_FRETS }).map((_, i) => {
        const fretNum = startFret + i;
        const x = nutX + (i + 0.5) * fretW;
        return (
          <text
            key={`l${i}`}
            x={x}
            y={height - 6}
            textAnchor="middle"
            fontFamily="JetBrains Mono"
            fontSize="9"
            fill="var(--color-ink)"
            opacity="0.55"
          >
            {fretNum}
          </text>
        );
      })}
      {/* Note dots */}
      {positions.map((p) => {
        let cx: number;
        if (p.fret === 0) {
          if (!showOpen) return null;
          cx = padX + openColW / 2;
        } else if (p.fret >= startFret && p.fret < startFret + VISIBLE_FRETS) {
          cx = nutX + (p.fret - startFret + 0.5) * fretW;
        } else {
          return null;
        }
        const cy = stringY(p.string);
        const fill = p.isRoot
          ? 'var(--color-accent)'
          : p.isBlueNote
            ? 'var(--color-brass)'
            : 'var(--color-ink)';
        const isOpen = p.fret === 0;
        return (
          <g key={`p-${p.string}-${p.fret}`}>
            <circle
              cx={cx}
              cy={cy}
              r={isOpen ? dotR - 1 : dotR}
              fill={isOpen ? 'var(--color-paper)' : fill}
              stroke={isOpen ? fill : 'none'}
              strokeWidth={isOpen ? 2 : 0}
            />
            <text
              x={cx}
              y={cy + 3.2}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fontWeight={p.isRoot ? 700 : 600}
              fill={isOpen ? fill : 'var(--color-paper)'}
            >
              {p.displayName}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default CompactFretboard;
