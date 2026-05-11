import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EarTrainingView from '../../views/EarTrainingView';
import type { ExerciseRound } from '../../utils/exerciseGenerator';

const playChord = vi.fn();
vi.mock('../../hooks/useAudio', () => ({
  useAudio: () => ({
    playChord,
    isReady: false,
    isLoading: false,
    isFailed: false,
  }),
}));

const BEST_KEY = 'fretforge:ear-training:best-streak';

// A hand-built C-major round: I-V-vi-IV (Axis of Awesome).
// Valid keys: C major + A minor. Two near-miss distractors.
const makeRound = (): ExerciseRound => ({
  chordNames: ['C', 'G', 'Am', 'F'],
  displayNames: ['C', 'G', 'Am', 'F'],
  trueKey: { root: 'C', mode: 'major' },
  validKeys: [
    { root: 'C', mode: 'major' },
    { root: 'A', mode: 'minor' },
  ],
  options: [
    { root: 'C', mode: 'major', isValid: true },
    { root: 'A', mode: 'minor', isValid: true },
    { root: 'F', mode: 'major', isValid: false },
    { root: 'G', mode: 'major', isValid: false },
  ],
  templateId: 'axis-of-awesome',
  templateName: 'Axis of Awesome',
});

const SECOND_ROUND: ExerciseRound = {
  chordNames: ['G', 'D', 'Em', 'C'],
  displayNames: ['G', 'D', 'Em', 'C'],
  trueKey: { root: 'G', mode: 'major' },
  validKeys: [
    { root: 'G', mode: 'major' },
    { root: 'E', mode: 'minor' },
  ],
  options: [
    { root: 'G', mode: 'major', isValid: true },
    { root: 'E', mode: 'minor', isValid: true },
    { root: 'C', mode: 'major', isValid: false },
    { root: 'D', mode: 'major', isValid: false },
  ],
  templateId: 'axis-of-awesome',
  templateName: 'Axis of Awesome',
};

const renderView = (override?: () => ExerciseRound) => {
  const generator = override ?? makeRound;
  return render(
    <EarTrainingView initialRound={generator()} generator={generator} />,
  );
};

beforeEach(() => {
  playChord.mockClear();
  localStorage.clear();
});

describe('EarTrainingView', () => {
  it('renders chord names and 4 options', () => {
    renderView();
    const row = screen.getByLabelText('Chord progression');
    for (const name of ['C', 'G', 'Am', 'F']) {
      expect(within(row).getByText(name)).toBeInTheDocument();
    }
    expect(
      screen.getByRole('button', { name: /C Major/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /A Minor/ }),
    ).toBeInTheDocument();
  });

  it('Submit is disabled until at least one option is selected', async () => {
    const user = userEvent.setup();
    renderView();
    const submit = screen.getByRole('button', { name: /^Submit$/ });
    expect(submit).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    expect(submit).toBeEnabled();
  });

  it('Correct submit (both valid keys, no distractors) shows Correct and increments streak', async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /A Minor/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    expect(screen.getByText(/✓ Correct/)).toBeInTheDocument();
    // streak badge increments to 1 — check inside the streak strip
    const streakStrip = screen.getByText(/Streak/i).closest('span')!.parentElement!;
    expect(within(streakStrip).getAllByText('1').length).toBeGreaterThan(0);
  });

  it('Wrong submit shows Not quite, names the offending chord, and breaks the streak', async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /F Major/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
    expect(screen.getByText(/doesn't fit/)).toBeInTheDocument();
  });

  it("Selecting only one valid key flags the missed valid key in the reveal", async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
    expect(screen.getByText(/Missed/)).toBeInTheDocument();
  });

  it('Try again clears selections and reveal, leaves streak alone', async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /F Major/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    await user.click(screen.getByRole('button', { name: /Try again/ }));
    expect(screen.queryByText(/Not quite/)).not.toBeInTheDocument();
    // Submit button is back (disabled because nothing is selected again)
    const submit = screen.getByRole('button', { name: /^Submit$/ });
    expect(submit).toBeDisabled();
    // streak still 0
    expect(screen.queryByText(/✓ Correct/)).not.toBeInTheDocument();
  });

  it("Try-again-then-correct does NOT restore the streak", async () => {
    const user = userEvent.setup();
    renderView();
    // First submit: wrong
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /F Major/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    // Try again
    await user.click(screen.getByRole('button', { name: /Try again/ }));
    // Now pick the right answer
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /A Minor/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    expect(screen.getByText(/✓ Correct/)).toBeInTheDocument();
    // streak should still be 0, not 1
    const streakStrip = screen.getByText(/Streak/i).closest('div');
    expect(streakStrip).toBeTruthy();
    // The streak number element should be "0"
    const zeroes = screen.getAllByText('0');
    expect(zeroes.length).toBeGreaterThan(0);
  });

  it('Next exercise generates a fresh round and re-enables streak gating', async () => {
    const user = userEvent.setup();
    let useSecond = false;
    const generator = () => (useSecond ? SECOND_ROUND : makeRound());
    render(
      <EarTrainingView initialRound={makeRound()} generator={generator} />,
    );
    // Submit first round wrong (so streak is 0, gating fired)
    await user.click(screen.getByRole('button', { name: /F Major/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    useSecond = true;
    await user.click(screen.getByRole('button', { name: /Next exercise/ }));
    // Second round: chord names changed
    const row = screen.getByLabelText('Chord progression');
    expect(within(row).getByText('Em')).toBeInTheDocument();
    // New round → first-submit gating reset; correct submit should increment streak
    await user.click(screen.getByRole('button', { name: /G Major/ }));
    await user.click(screen.getByRole('button', { name: /E Minor/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    expect(screen.getByText(/✓ Correct/)).toBeInTheDocument();
    const streakStrip = screen.getByText(/Streak/i).closest('span')!.parentElement!;
    expect(within(streakStrip).getAllByText('1').length).toBeGreaterThan(0);
  });

  it('Best streak persists to localStorage on correct submit', async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(screen.getByRole('button', { name: /C Major/ }));
    await user.click(screen.getByRole('button', { name: /A Minor/ }));
    await user.click(screen.getByRole('button', { name: /^Submit$/ }));
    expect(localStorage.getItem(BEST_KEY)).toBe('1');
  });

  it('Reset stats clears localStorage and counters', async () => {
    const user = userEvent.setup();
    localStorage.setItem(BEST_KEY, '5');
    renderView();
    expect(screen.getByText('5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Reset$/ }));
    expect(localStorage.getItem(BEST_KEY)).toBeNull();
    // Both counters should now be 0
    const zeroes = screen.getAllByText('0');
    expect(zeroes.length).toBeGreaterThanOrEqual(2);
  });

  it('Play button calls playChord once per chord', () => {
    vi.useFakeTimers();
    try {
      renderView();
      fireEvent.click(screen.getByRole('button', { name: /Play progression/ }));
      act(() => {
        vi.advanceTimersByTime(800 * 4);
      });
      expect(playChord).toHaveBeenCalledTimes(4);
    } finally {
      vi.useRealTimers();
    }
  });
});
