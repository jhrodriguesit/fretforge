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
  it('renders the roman numeral', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  it('renders the function label', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByText(/Tonic/i)).toBeInTheDocument();
  });

  it('renders the chord display name', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(screen.getByText('C', { selector: '.serif' })).toBeInTheDocument();
  });

  it('renders the chord diagram', () => {
    render(<ChordCard degree={DEGREE} />);
    expect(
      screen.getByRole('img', { name: /C chord diagram/i }),
    ).toBeInTheDocument();
  });
});
