import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TheoryNotes from './TheoryNotes';

describe('TheoryNotes', () => {
  it('renders A Major interval pattern and relative minor', () => {
    render(
      <TheoryNotes selectedRoot="A" scaleMode="major" scaleType="major" />,
    );
    expect(screen.getByText('Theory Note')).toBeInTheDocument();
    expect(screen.getByText('Relative Minor')).toBeInTheDocument();
    expect(screen.getByText('W-W-H-W-W-W-H')).toBeInTheDocument();
    expect(screen.getByText('F# minor')).toBeInTheDocument();
  });

  it('updates when switched to A Minor', () => {
    const { rerender } = render(
      <TheoryNotes selectedRoot="A" scaleMode="major" scaleType="major" />,
    );
    rerender(
      <TheoryNotes selectedRoot="A" scaleMode="minor" scaleType="minor" />,
    );
    expect(screen.getByText('Relative Major')).toBeInTheDocument();
    expect(screen.getByText('C Major')).toBeInTheDocument();
    expect(screen.getByText('W-H-W-W-H-W-W')).toBeInTheDocument();
  });

  it('says C Major has no sharps or flats', () => {
    render(
      <TheoryNotes selectedRoot="C" scaleMode="major" scaleType="major" />,
    );
    const card = screen.getByText('Theory Note').parentElement;
    expect(card?.textContent).toContain('no sharps or flats');
  });
});
