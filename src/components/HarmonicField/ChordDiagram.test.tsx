import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChordDiagram from './ChordDiagram';
import type { ChordVoicing } from '../../types/music';

// C: [-1, 3, 2, 0, 1, 0] — 1 muted, 2 open, 3 fingered
const C_VOICING: ChordVoicing = {
  frets: [-1, 3, 2, 0, 1, 0],
  fingers: [0, 3, 2, 0, 1, 0],
  baseFret: 1,
};

describe('ChordDiagram', () => {
  it('renders an SVG', () => {
    render(<ChordDiagram voicing={C_VOICING} chordName="C" />);
    expect(screen.getByRole('img', { name: /C chord diagram/i })).toBeInTheDocument();
  });

  it('renders the correct number of finger dots', () => {
    render(<ChordDiagram voicing={C_VOICING} chordName="C" />);
    expect(screen.getAllByTestId('finger-dot')).toHaveLength(3);
  });

  it('shows X for muted strings', () => {
    render(<ChordDiagram voicing={C_VOICING} chordName="C" />);
    expect(screen.getAllByTestId('muted-marker')).toHaveLength(1);
  });

  it('shows O for open strings', () => {
    render(<ChordDiagram voicing={C_VOICING} chordName="C" />);
    expect(screen.getAllByTestId('open-marker')).toHaveLength(2);
  });

  it('omits the base-fret label when baseFret is 1', () => {
    render(<ChordDiagram voicing={C_VOICING} chordName="C" />);
    expect(screen.queryByTestId('base-fret-label')).not.toBeInTheDocument();
  });

  it('shows the base-fret label when baseFret is greater than 1', () => {
    const barreD: ChordVoicing = {
      frets: [-1, 5, 7, 7, 7, 5],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 5,
      barres: [5],
    };
    render(<ChordDiagram voicing={barreD} chordName="D" />);
    expect(screen.getByTestId('base-fret-label')).toHaveTextContent(/5/);
    expect(screen.getByTestId('barre')).toBeInTheDocument();
  });
});
