import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoicingNav from './VoicingNav';

describe('VoicingNav', () => {
  it('displays current and total', () => {
    render(<VoicingNav current={0} total={3} onChange={() => {}} />);
    expect(screen.getByText(/Voicing 1 of 3/i)).toBeInTheDocument();
  });

  it('clicking next increments', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<VoicingNav current={0} total={3} onChange={onChange} />);
    await user.click(screen.getByLabelText('Next voicing'));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('next wraps past the last voicing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<VoicingNav current={2} total={3} onChange={onChange} />);
    await user.click(screen.getByLabelText('Next voicing'));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('prev wraps to the last voicing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<VoicingNav current={0} total={3} onChange={onChange} />);
    await user.click(screen.getByLabelText('Previous voicing'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('hides arrows when only one voicing exists', () => {
    render(<VoicingNav current={0} total={1} onChange={() => {}} />);
    expect(screen.queryByLabelText('Next voicing')).not.toBeInTheDocument();
  });
});
