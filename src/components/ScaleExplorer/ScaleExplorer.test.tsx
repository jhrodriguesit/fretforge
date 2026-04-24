import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScaleExplorer from './ScaleExplorer';

describe('ScaleExplorer', () => {
  it('renders the section heading and subtitle for A major by default', () => {
    render(<ScaleExplorer selectedRoot="A" />);
    expect(screen.getByText('Scale Explorer')).toBeInTheDocument();
    expect(screen.getByText('A Major Patterns')).toBeInTheDocument();
  });

  it('renders all five scale type tabs', () => {
    render(<ScaleExplorer selectedRoot="A" />);
    for (const label of [
      'Major',
      'Minor',
      'Major Pentatonic',
      'Minor Pentatonic',
      'Blues',
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
  });

  it('renders 5 shape buttons', () => {
    render(<ScaleExplorer selectedRoot="A" />);
    for (let i = 1; i <= 5; i++) {
      expect(
        screen.getByRole('button', { name: `Shape ${i}` }),
      ).toBeInTheDocument();
    }
  });

  it('updates the subtitle when switching to Minor Pentatonic', () => {
    render(<ScaleExplorer selectedRoot="C" />);
    expect(screen.getByText('C Major Patterns')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Minor Pentatonic' }));
    expect(screen.getByText('C Minor Pentatonic Patterns')).toBeInTheDocument();
  });

  it('Blues tab always shows the minor pentatonic blues scale', () => {
    render(<ScaleExplorer selectedRoot="C" />);
    fireEvent.click(screen.getByRole('button', { name: 'Major Pentatonic' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blues' }));
    expect(screen.getByText('C Blues Patterns')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Minor Pentatonic' }));
    fireEvent.click(screen.getByRole('button', { name: 'Blues' }));
    expect(screen.getByText('C Blues Patterns')).toBeInTheDocument();
  });

  it('marks the selected shape', () => {
    render(<ScaleExplorer selectedRoot="A" />);
    const shape1 = screen.getByRole('button', { name: 'Shape 1' });
    const shape3 = screen.getByRole('button', { name: 'Shape 3' });
    expect(shape1.getAttribute('data-active')).toBe('true');
    expect(shape3.getAttribute('data-active')).toBe('false');
    fireEvent.click(shape3);
    expect(shape3.getAttribute('data-active')).toBe('true');
    expect(shape1.getAttribute('data-active')).toBe('false');
  });
});
