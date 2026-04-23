import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Fretboard from './Fretboard';
import { getScalePositions, getFretRange } from '../../utils/guitarUtils';
import { CAGED_SHAPES } from '../../data/scales';

describe('Fretboard', () => {
  it('renders one note circle per scale position', () => {
    const positions = getScalePositions(
      'A',
      'minorPentatonic',
      CAGED_SHAPES[0],
    );
    const { startFret, endFret } = getFretRange(CAGED_SHAPES[0], 'A');
    const { container } = render(
      <Fretboard
        positions={positions}
        startFret={startFret}
        endFret={endFret}
      />,
    );
    const visible = positions.filter(
      (p) => p.fret >= startFret && p.fret <= endFret,
    );
    // Each position = <circle r="13"> with a sibling <text>.
    const noteCircles = container.querySelectorAll('circle[r="13"]');
    expect(noteCircles.length).toBe(visible.length);
  });

  it('renders an SVG with the expected role', () => {
    const { getByRole } = render(
      <Fretboard positions={[]} startFret={0} endFret={12} />,
    );
    expect(getByRole('img')).toBeInTheDocument();
  });

  it('renders fret numbers', () => {
    const { container } = render(
      <Fretboard positions={[]} startFret={0} endFret={12} />,
    );
    const texts = Array.from(container.querySelectorAll('text')).map(
      (t) => t.textContent,
    );
    expect(texts).toContain('3');
    expect(texts).toContain('5');
    expect(texts).toContain('12');
  });
});
