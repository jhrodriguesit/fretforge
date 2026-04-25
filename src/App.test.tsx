import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#/';
  });

  it('renders the landing page by default', () => {
    render(<App />);
    expect(screen.getAllByText('FretForge').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/A reference for guitar players/i),
    ).toBeInTheDocument();
  });

  it('renders the harmony view when route is harmony', () => {
    window.location.hash = '#/harmony';
    render(<App />);
    expect(screen.getByText(/01 · Harmony/)).toBeInTheDocument();
    const pressedButtons = screen.getAllByRole('button', { pressed: true });
    expect(pressedButtons.find((b) => b.textContent === 'C')).toBeDefined();
    expect(pressedButtons.find((b) => b.textContent === 'Major')).toBeDefined();
  });

  it('renders the scales view when route is scales', () => {
    window.location.hash = '#/scales';
    render(<App />);
    expect(screen.getByText(/02 · Scales/)).toBeInTheDocument();
  });
});
