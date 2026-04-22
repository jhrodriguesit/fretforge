import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HarmonicField from './HarmonicField';

describe('HarmonicField', () => {
  it('renders 7 chord cards', () => {
    render(<HarmonicField selectedRoot="C" scaleMode="major" />);
    expect(screen.getAllByText(/Degree/i)).toHaveLength(7);
  });

  it('renders the I chord name for C major', () => {
    render(<HarmonicField selectedRoot="C" scaleMode="major" />);
    expect(screen.getByRole('heading', { name: 'C' })).toBeInTheDocument();
  });

  it('re-renders when root changes', () => {
    const { rerender } = render(
      <HarmonicField selectedRoot="C" scaleMode="major" />,
    );
    expect(screen.getByRole('heading', { name: 'C' })).toBeInTheDocument();
    rerender(<HarmonicField selectedRoot="G" scaleMode="major" />);
    expect(screen.getByRole('heading', { name: 'G' })).toBeInTheDocument();
  });

  it('re-renders when mode changes', () => {
    const { rerender } = render(
      <HarmonicField selectedRoot="A" scaleMode="major" />,
    );
    expect(screen.getByRole('heading', { name: 'A' })).toBeInTheDocument();
    rerender(<HarmonicField selectedRoot="A" scaleMode="minor" />);
    expect(screen.getByRole('heading', { name: 'Am' })).toBeInTheDocument();
  });
});
