import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('shows burger button on mobile', () => {
    render(<Header active="" />);
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('toggles aria-expanded on burger click', () => {
    render(<Header active="" />);
    const burger = screen.getByRole('button', { name: 'Open menu' });

    fireEvent.click(burger);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes drawer when a nav item is clicked', () => {
    render(<Header active="" />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    // Drawer nav items are rendered alongside desktop nav items — click the last one
    const harmonyButtons = screen.getAllByRole('button', { name: 'Harmony' });
    fireEvent.click(harmonyButtons[harmonyButtons.length - 1]);

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});
