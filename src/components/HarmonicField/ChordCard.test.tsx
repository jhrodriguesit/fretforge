import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChordCard from './ChordCard';
import type { HarmonicFieldDegree } from '../../types/music';

const DEGREE: HarmonicFieldDegree = {
  degree: 1,
  numeral: 'I',
  chordName: 'C',
  displayName: 'C',
  quality: 'major',
};

describe('ChordCard', () => {
  it('renders degree label', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByText(/I Degree/i)).toBeInTheDocument();
  });

  it('renders chord name', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByRole('heading', { name: 'C' })).toBeInTheDocument();
  });

  it('renders diagram', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByRole('img', { name: /C chord diagram/i })).toBeInTheDocument();
  });

  it('renders voicing nav', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByText(/Voicing 1 of/i)).toBeInTheDocument();
  });

  it('renders play button', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByLabelText(/Play C/i)).toBeInTheDocument();
  });
});
