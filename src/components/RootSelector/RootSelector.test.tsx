import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RootSelector from './RootSelector';

describe('RootSelector', () => {
  it('renders 12 note buttons', () => {
    render(<RootSelector selectedRoot="C" onRootChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(12);
  });

  it('marks the selected note with aria-pressed', () => {
    render(<RootSelector selectedRoot="A" onRootChange={() => {}} />);
    expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('C')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onRootChange when a note is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RootSelector selectedRoot="C" onRootChange={onChange} />);
    await user.click(screen.getByText('G'));
    expect(onChange).toHaveBeenCalledWith('G');
  });
});
