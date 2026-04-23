import type { FretboardPosition } from '../../utils/guitarUtils';

interface FretboardProps {
  positions: FretboardPosition[];
  startFret: number;
  endFret: number;
}

const STRING_COUNT = 6;
const SINGLE_DOT_FRETS = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_DOT_FRETS = [12, 24];

const Fretboard = ({ positions, startFret, endFret }: FretboardProps) => {
  const fretCount = endFret - startFret;
  const fretWidth = 60;
  const stringGap = 32;
  const paddingX = 32;
  const paddingTop = 36;
  const paddingBottom = 20;

  const width = paddingX * 2 + fretCount * fretWidth;
  const height = paddingTop + (STRING_COUNT - 1) * stringGap + paddingBottom;

  const fretX = (fret: number): number =>
    paddingX + (fret - startFret) * fretWidth;

  // Note circles sit mid-fret (between fret wires). For fret 0 (open), place at nut.
  const noteX = (fret: number): number => {
    if (fret === 0) return paddingX - 14;
    return fretX(fret) - fretWidth / 2;
  };

  // Strings: visually high-E on top, low-E on bottom.
  // String index: 0 = low E (bottom), 5 = high E (top).
  const stringY = (stringIndex: number): number =>
    paddingTop + (STRING_COUNT - 1 - stringIndex) * stringGap;

  const fretWires: number[] = [];
  for (let f = startFret; f <= endFret; f++) fretWires.push(f);

  const fretMarkers: Array<{ fret: number; double: boolean }> = [];
  for (let f = startFret + 1; f <= endFret; f++) {
    if (DOUBLE_DOT_FRETS.includes(f)) fretMarkers.push({ fret: f, double: true });
    else if (SINGLE_DOT_FRETS.includes(f))
      fretMarkers.push({ fret: f, double: false });
  }

  const markersY1 = stringY(3) + stringGap / 2; // between strings 3 and 2 (B and G)
  const markersY2 = stringY(2) - stringGap / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      role="img"
      aria-label="Guitar fretboard"
    >
      {/* Fret markers (inlay dots) */}
      {fretMarkers.map((m) => {
        const x = fretX(m.fret) - fretWidth / 2;
        if (m.double) {
          return (
            <g key={`marker-${m.fret}`}>
              <circle cx={x} cy={markersY1} r={4} fill="#2A2A2A" />
              <circle cx={x} cy={markersY2} r={4} fill="#2A2A2A" />
            </g>
          );
        }
        return (
          <circle
            key={`marker-${m.fret}`}
            cx={x}
            cy={(stringY(2) + stringY(3)) / 2}
            r={4}
            fill="#2A2A2A"
          />
        );
      })}

      {/* Fret wires */}
      {fretWires.map((f) => {
        const x = fretX(f);
        const isNut = f === 0;
        return (
          <line
            key={`wire-${f}`}
            x1={x}
            x2={x}
            y1={stringY(5)}
            y2={stringY(0)}
            stroke={isNut ? '#FFFFFF' : '#2A2A2A'}
            strokeWidth={isNut ? 4 : 1}
          />
        );
      })}

      {/* Strings */}
      {Array.from({ length: STRING_COUNT }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={paddingX}
          x2={width - paddingX}
          y1={stringY(i)}
          y2={stringY(i)}
          stroke="#888888"
          strokeWidth={0.75 + (STRING_COUNT - 1 - i) * 0.25}
        />
      ))}

      {/* Fret numbers */}
      {fretWires.map((f) => {
        if (f === 0) return null;
        const highlighted = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24].includes(f);
        return (
          <text
            key={`num-${f}`}
            x={fretX(f) - fretWidth / 2}
            y={16}
            textAnchor="middle"
            fontSize={11}
            fontWeight={700}
            fill={highlighted ? '#888888' : '#555555'}
            fontFamily="JetBrains Mono, monospace"
          >
            {f}
          </text>
        );
      })}

      {/* Note circles */}
      {positions
        .filter((p) => p.fret >= startFret && p.fret <= endFret)
        .map((p) => {
          const cx = noteX(p.fret);
          const cy = stringY(p.string);
          const fill = p.isRoot ? '#F5A623' : '#FFFFFF';
          const textFill = p.isRoot ? '#472A00' : '#0D0D0D';
          return (
            <g key={`pos-${p.string}-${p.fret}`}>
              <circle
                cx={cx}
                cy={cy}
                r={13}
                fill={fill}
                stroke="#0D0D0D"
                strokeWidth={2}
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={10}
                fontWeight={p.isRoot ? 900 : 700}
                fill={textFill}
                fontFamily="JetBrains Mono, monospace"
              >
                {p.note}
              </text>
            </g>
          );
        })}
    </svg>
  );
};

export default Fretboard;
