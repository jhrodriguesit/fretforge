import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TheoryNotes from './TheoryNotes';

describe('TheoryNotes', () => {
  it('renders A Major interval pattern and relative minor', () => {
    render(
      <TheoryNotes selectedRoot="A" scaleMode="major" scaleType="major" />,
    );
    expect(screen.getByText(/theory note/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/relative minor/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('W-W-H-W-W-W-H')).toBeInTheDocument();
  });

  it('updates when switched to A Minor', () => {
    const { rerender } = render(
      <TheoryNotes selectedRoot="A" scaleMode="major" scaleType="major" />,
    );
    rerender(
      <TheoryNotes selectedRoot="A" scaleMode="minor" scaleType="minor" />,
    );
    expect(
      screen.getAllByText(/relative major/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText('W-H-W-W-H-W-W')).toBeInTheDocument();
  });

  it('says C Major has no sharps or flats', () => {
    render(
      <TheoryNotes selectedRoot="C" scaleMode="major" scaleType="major" />,
    );
    expect(
      screen.getByText(/no sharps or flats/i),
    ).toBeInTheDocument();
  });
});
