import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the app name', () => {
    render(<Header active="" />);
    expect(screen.getByText('FretForge')).toBeInTheDocument();
  });

  it('highlights the active nav item', () => {
    render(<Header active="harmony" />);
    const harmony = screen.getByRole('button', { name: 'Harmony' });
    expect(harmony).toHaveStyle({ color: 'var(--color-accent)' });
  });
});
