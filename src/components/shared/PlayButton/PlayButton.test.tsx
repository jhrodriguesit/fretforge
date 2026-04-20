import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayButton from './PlayButton';

describe('PlayButton', () => {
  it('renders a button', () => {
    render(<PlayButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PlayButton onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<PlayButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
