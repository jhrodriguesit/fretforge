import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChordCard from './ChordCard';
import type { HarmonicFieldDegree } from '../../types/music';

const playChord = vi.fn();
vi.mock('../../hooks/useAudio', () => ({
  useAudio: () => ({ playChord, isReady: false }),
}));

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

  it('plays the active voicing when the play button is clicked', async () => {
    playChord.mockClear();
    const user = userEvent.setup();
    render(<ChordCard degree={DEGREE} />);
    await user.click(screen.getByRole('button', { name: /Play C chord/i }));
    expect(playChord).toHaveBeenCalledTimes(1);
    const notes = playChord.mock.calls[0][0] as string[];
    expect(notes.length).toBeGreaterThan(0);
    expect(notes.every((n) => /^[A-G]#?\d$/.test(n))).toBe(true);
  });
});
