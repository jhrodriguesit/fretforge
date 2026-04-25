import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HarmonicField from './HarmonicField';

describe('HarmonicField', () => {
  it('renders 7 chord diagrams', () => {
    render(<HarmonicField selectedRoot="C" scaleMode="major" />);
    expect(screen.getAllByRole('img', { name: /chord diagram/i })).toHaveLength(
      7,
    );
  });

  it('renders the I chord name for C major', () => {
    render(<HarmonicField selectedRoot="C" scaleMode="major" />);
    expect(
      screen.getByRole('img', { name: /C chord diagram/i }),
    ).toBeInTheDocument();
  });

  it('re-renders when root changes', () => {
    const { rerender } = render(
      <HarmonicField selectedRoot="C" scaleMode="major" />,
    );
    expect(
      screen.getByRole('img', { name: /^C chord diagram$/i }),
    ).toBeInTheDocument();
    rerender(<HarmonicField selectedRoot="G" scaleMode="major" />);
    expect(
      screen.getByRole('img', { name: /^G chord diagram$/i }),
    ).toBeInTheDocument();
  });

  it('re-renders when mode changes', () => {
    const { rerender } = render(
      <HarmonicField selectedRoot="A" scaleMode="major" />,
    );
    expect(
      screen.getByRole('img', { name: /^A chord diagram$/i }),
    ).toBeInTheDocument();
    rerender(<HarmonicField selectedRoot="A" scaleMode="minor" />);
    expect(
      screen.getByRole('img', { name: /^Am chord diagram$/i }),
    ).toBeInTheDocument();
  });

  it('renders the progressions cell', () => {
    render(<HarmonicField selectedRoot="C" scaleMode="major" />);
    expect(screen.getByText(/progressions to try/i)).toBeInTheDocument();
  });
});
