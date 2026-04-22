import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RootSelector from './RootSelector';

describe('RootSelector', () => {
  it('renders 12 note buttons', () => {
    render(<RootSelector selectedRoot="C" mode="major" onRootChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('marks the selected note with aria-pressed', () => {
    render(<RootSelector selectedRoot="A" mode="major" onRootChange={() => {}} />);
    expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('C')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onRootChange with the pitch-class key when a button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RootSelector selectedRoot="C" mode="major" onRootChange={onChange} />);
    await user.click(screen.getByText('G'));
    expect(onChange).toHaveBeenCalledWith('G');
  });

  it('shows flat labels in major mode for conventionally-flat keys', () => {
    render(<RootSelector selectedRoot="C" mode="major" onRootChange={() => {}} />);
    expect(screen.getByText('Bb')).toBeInTheDocument();
    expect(screen.getByText('Eb')).toBeInTheDocument();
    expect(screen.getByText('Ab')).toBeInTheDocument();
    expect(screen.getByText('Db')).toBeInTheDocument();
    expect(screen.getByText('F#')).toBeInTheDocument();
    expect(screen.queryByText('A#')).not.toBeInTheDocument();
  });

  it('shows sharp labels for conventionally-sharp minor keys', () => {
    render(<RootSelector selectedRoot="C" mode="minor" onRootChange={() => {}} />);
    expect(screen.getByText('C#')).toBeInTheDocument();
    expect(screen.getByText('F#')).toBeInTheDocument();
    expect(screen.getByText('G#')).toBeInTheDocument();
    expect(screen.getByText('Eb')).toBeInTheDocument();
    expect(screen.getByText('Bb')).toBeInTheDocument();
  });

  it('clicking Bb in major still passes the sharp pitch class A#', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RootSelector selectedRoot="C" mode="major" onRootChange={onChange} />);
    await user.click(screen.getByText('Bb'));
    expect(onChange).toHaveBeenCalledWith('A#');
  });
});
