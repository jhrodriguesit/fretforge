import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Fretforge')).toBeInTheDocument();
  });

  it('defaults to C Major', () => {
    render(<App />);
    const pressedButtons = screen.getAllByRole('button', { pressed: true });
    expect(pressedButtons).toHaveLength(1);
    expect(pressedButtons[0]).toHaveTextContent('C');
    const majorButton = screen
      .getAllByRole('button', { name: 'Major' })
      .find((b) => b.classList.contains('bg-accent'));
    expect(majorButton).toBeDefined();
  });
});
