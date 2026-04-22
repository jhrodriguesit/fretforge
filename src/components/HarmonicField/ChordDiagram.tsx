import type { ChordVoicing } from '../../types/music';

interface ChordDiagramProps {
  voicing: ChordVoicing;
  chordName: string;
}

const GRID_LEFT = 14;
const GRID_RIGHT = 86;
const GRID_TOP = 24;
const FRET_HEIGHT = 22;
const NUM_FRETS = 4;
const STRING_COUNT = 6;

const stringX = (stringIndex: number) =>
  GRID_LEFT + (stringIndex * (GRID_RIGHT - GRID_LEFT)) / (STRING_COUNT - 1);

const fretY = (fretIndex: number) => GRID_TOP + fretIndex * FRET_HEIGHT;

const ChordDiagram = ({ voicing, chordName }: ChordDiagramProps) => {
  const { frets, fingers, baseFret } = voicing;
  // diagram string order: low E on left → high E on right (same as frets[0..5])
  const nutHeight = baseFret === 1 ? 4 : 1.2;
  const gridBottom = fretY(NUM_FRETS);

  return (
    <svg
      viewBox="0 0 100 150"
      width="110"
      height="170"
      role="img"
      aria-label={`${chordName} chord diagram`}
      className="text-text-primary"
    >
      <title>{chordName}</title>

      {/* nut / top fret */}
      <line
        x1={stringX(0) - 0.5}
        x2={stringX(STRING_COUNT - 1) + 0.5}
        y1={GRID_TOP}
        y2={GRID_TOP}
        stroke="currentColor"
        strokeWidth={nutHeight}
      />

      {/* fret lines */}
      {Array.from({ length: NUM_FRETS }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={stringX(0)}
          x2={stringX(STRING_COUNT - 1)}
          y1={fretY(i + 1)}
          y2={fretY(i + 1)}
          stroke="currentColor"
          strokeWidth={1.2}
          opacity={0.9}
        />
      ))}

      {/* strings */}
      {Array.from({ length: STRING_COUNT }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={stringX(i)}
          x2={stringX(i)}
          y1={GRID_TOP}
          y2={gridBottom}
          stroke="currentColor"
          strokeWidth={i === 0 ? 1.6 : 1.2}
        />
      ))}

      {/* base fret label (e.g. "5ª") shown above top-left when position is higher on the neck */}
      {baseFret > 1 && (
        <text
          x={0}
          y={GRID_TOP - 4}
          fontSize="9"
          fill="currentColor"
          textAnchor="start"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="bold"
          data-testid="base-fret-label"
        >
          {baseFret}ª
        </text>
      )}

      {/* barre bar(s) across strings */}
      {voicing.barres?.map((barreFret) => {
        const relative = barreFret - (baseFret - 1);
        if (relative < 1 || relative > NUM_FRETS) return null;
        const cy = fretY(relative - 1) + FRET_HEIGHT / 2;
        // barre spans from first to last string fretted at or above this fret
        const indices = frets
          .map((f, i) => (f >= barreFret ? i : -1))
          .filter((i) => i !== -1);
        if (indices.length < 2) return null;
        const from = Math.min(...indices);
        const to = Math.max(...indices);
        return (
          <line
            key={`barre-${barreFret}`}
            x1={stringX(from)}
            x2={stringX(to)}
            y1={cy}
            y2={cy}
            stroke="currentColor"
            strokeWidth={7}
            strokeLinecap="round"
            data-testid="barre"
          />
        );
      })}

      {/* muted / open indicators above the nut */}
      {frets.map((fret, i) => {
        const cx = stringX(i);
        const cy = GRID_TOP - 7;
        if (fret === -1) {
          return (
            <text
              key={`mute-${i}`}
              x={cx}
              y={cy + 2}
              fontSize="8"
              fill="currentColor"
              textAnchor="middle"
              data-testid="muted-marker"
            >
              X
            </text>
          );
        }
        if (fret === 0) {
          return (
            <circle
              key={`open-${i}`}
              cx={cx}
              cy={cy}
              r={2.5}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.8}
              data-testid="open-marker"
            />
          );
        }
        return null;
      })}

      {/* finger dots */}
      {frets.map((fret, i) => {
        if (fret <= 0) return null;
        const relative = fret - (baseFret - 1);
        if (relative < 1 || relative > NUM_FRETS) return null;
        const cx = stringX(i);
        const cy = fretY(relative - 1) + FRET_HEIGHT / 2;
        return (
          <circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r={4.5}
            fill="currentColor"
            data-testid="finger-dot"
          />
        );
      })}

      {/* finger numbers below grid */}
      {fingers.map((finger, i) => {
        if (finger <= 0) return null;
        return (
          <text
            key={`finger-${i}`}
            x={stringX(i)}
            y={gridBottom + 12}
            fontSize="8"
            fill="currentColor"
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            opacity={0.7}
          >
            {finger}
          </text>
        );
      })}
    </svg>
  );
};

export default ChordDiagram;
