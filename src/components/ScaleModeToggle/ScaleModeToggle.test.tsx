import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScaleModeToggle from './ScaleModeToggle';

describe('ScaleModeToggle', () => {
  it('renders Major and Minor buttons', () => {
    render(<ScaleModeToggle mode="major" onModeChange={() => {}} />);
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
  });

  it('calls onModeChange when toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ScaleModeToggle mode="major" onModeChange={onChange} />);
    await user.click(screen.getByText('Minor'));
    expect(onChange).toHaveBeenCalledWith('minor');
  });
});
