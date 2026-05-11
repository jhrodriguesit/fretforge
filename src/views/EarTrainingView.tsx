import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  generateRound,
  type ExerciseRound,
} from '../utils/exerciseGenerator';
import { CHORD_DATABASE } from '../data/chords';
import { voicingToPitches } from '../utils/guitarUtils';
import { useAudio } from '../hooks/useAudio';
import TagLabel from '../components/shared/TagLabel/TagLabel';
import ForgeButton from '../components/shared/ForgeButton/ForgeButton';
import ProgressionDisplay from '../components/EarTraining/ProgressionDisplay';
import KeyOptions from '../components/EarTraining/KeyOptions';
import Reveal from '../components/EarTraining/Reveal';
import StreakBadge from '../components/EarTraining/StreakBadge';

const BEST_STREAK_KEY = 'fretforge:ear-training:best-streak';
const CHORD_GAP_MS = 800;

const optId = (k: { root: string; mode: string }) => `${k.root}|${k.mode}`;

const readBestStreak = (): number => {
  try {
    const raw = localStorage.getItem(BEST_STREAK_KEY);
    if (!raw) return 0;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
};

const writeBestStreak = (n: number) => {
  try {
    localStorage.setItem(BEST_STREAK_KEY, String(n));
  } catch {
    // ignore
  }
};

const clearBestStreak = () => {
  try {
    localStorage.removeItem(BEST_STREAK_KEY);
  } catch {
    // ignore
  }
};

interface EarTrainingViewProps {
  initialRound?: ExerciseRound;
  generator?: () => ExerciseRound;
}

const EarTrainingView = ({
  initialRound,
  generator = generateRound,
}: EarTrainingViewProps = {}) => {
  const [round, setRound] = useState<ExerciseRound>(
    () => initialRound ?? generator(),
  );
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const wasFirstSubmitRef = useRef(true);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState<number>(() => readBestStreak());
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const playTimeoutsRef = useRef<number[]>([]);

  const { playChord, isLoading, isFailed } = useAudio();

  const validIds = useMemo(
    () => new Set(round.options.filter((o) => o.isValid).map(optId)),
    [round],
  );

  const clearPlayTimers = useCallback(() => {
    for (const id of playTimeoutsRef.current) clearTimeout(id);
    playTimeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearPlayTimers(), [clearPlayTimers]);

  const handleToggle = (id: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0 || submitted) return;
    const sameSize = selected.size === validIds.size;
    let allMatch = sameSize;
    if (sameSize) {
      for (const id of selected) {
        if (!validIds.has(id)) {
          allMatch = false;
          break;
        }
      }
    }
    setWasCorrect(allMatch);
    setSubmitted(true);

    if (wasFirstSubmitRef.current) {
      if (allMatch) {
        setStreak((s) => {
          const next = s + 1;
          if (next > bestStreak) {
            setBestStreak(next);
            writeBestStreak(next);
          }
          return next;
        });
      } else {
        setStreak(0);
      }
    }
    wasFirstSubmitRef.current = false;
  };

  const handleTryAgain = () => {
    setSelected(new Set());
    setSubmitted(false);
    setWasCorrect(false);
  };

  const handleNext = () => {
    clearPlayTimers();
    setPlayingIndex(null);
    setRound(generator());
    setSelected(new Set());
    setSubmitted(false);
    setWasCorrect(false);
    wasFirstSubmitRef.current = true;
  };

  const handleReset = () => {
    clearBestStreak();
    setBestStreak(0);
    setStreak(0);
  };

  const handlePlay = () => {
    clearPlayTimers();
    round.chordNames.forEach((chordName, i) => {
      const id = window.setTimeout(() => {
        setPlayingIndex(i);
        const voicing = CHORD_DATABASE[chordName]?.[0];
        if (voicing) playChord(voicingToPitches(voicing));
        if (i === round.chordNames.length - 1) {
          const tail = window.setTimeout(() => setPlayingIndex(null), CHORD_GAP_MS);
          playTimeoutsRef.current.push(tail);
        }
      }, i * CHORD_GAP_MS);
      playTimeoutsRef.current.push(id);
    });
  };

  const isPlaying = playingIndex !== null;
  const canSubmit = selected.size > 0 && !submitted;

  return (
    <div style={{ background: 'var(--color-paper)' }} className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-12 pb-8">
        <TagLabel>03 · Ear Training</TagLabel>
        <h1
          className="serif mt-2.5 text-4xl sm:text-5xl md:text-[56px]"
          style={{ lineHeight: 0.98, letterSpacing: '-0.01em' }}
        >
          Find the key{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>
            by ear.
          </span>
        </h1>
        <p
          className="mt-3.5 max-w-[560px]"
          style={{
            fontSize: 14,
            color: 'var(--color-ink-2)',
            lineHeight: 1.6,
          }}
        >
          One short progression. Listen, then pick every key whose harmonic
          field fits these chords.
        </p>
        <div className="mt-5">
          <StreakBadge
            streak={streak}
            bestStreak={bestStreak}
            onReset={handleReset}
          />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pb-20">
        <div
          style={{
            border: '1px solid var(--color-rule)',
            background: 'var(--color-paper)',
            borderRadius: 'var(--radius-md)',
            padding: '32px 24px',
          }}
        >
          <ProgressionDisplay
            displayNames={round.displayNames}
            playingIndex={playingIndex}
            onPlay={handlePlay}
            isPlaying={isPlaying}
            isLoading={isLoading}
            isFailed={isFailed}
          />

          <div className="mt-8">
            <KeyOptions
              options={round.options}
              selected={selected}
              disabled={submitted}
              revealed={submitted}
              onToggle={handleToggle}
            />
          </div>

          {!submitted && (
            <div className="mt-6 flex justify-end">
              <ForgeButton
                variant="primary"
                arrow={false}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Submit
              </ForgeButton>
            </div>
          )}

          {submitted && (
            <Reveal
              chordNames={round.chordNames}
              options={round.options}
              selectedIds={selected}
              wasCorrect={wasCorrect}
              onTryAgain={handleTryAgain}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EarTrainingView;
