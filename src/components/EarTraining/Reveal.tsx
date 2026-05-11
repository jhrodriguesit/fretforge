import type {
  ExerciseOption,
  KeyChoice,
} from '../../utils/exerciseGenerator';
import { degreesForKey } from '../../utils/exerciseGenerator';
import { getKeySpelling } from '../../data/keySignatures';
import { getHarmonicField } from '../../utils/musicTheory';
import ForgeButton from '../shared/ForgeButton/ForgeButton';

interface RevealProps {
  chordNames: string[];
  options: ExerciseOption[];
  selectedIds: Set<string>;
  wasCorrect: boolean;
  onTryAgain: () => void;
  onNext: () => void;
}

const optId = (k: { root: string; mode: string }) => `${k.root}|${k.mode}`;
const keyLabel = (k: KeyChoice) =>
  `${getKeySpelling(k.root, k.mode)[0]} ${k.mode === 'major' ? 'Major' : 'Minor'}`;

const Reveal = ({
  chordNames,
  options,
  selectedIds,
  wasCorrect,
  onTryAgain,
  onNext,
}: RevealProps) => {
  const validKeys = options.filter((o) => o.isValid);
  const wrongPicks = options.filter((o) => !o.isValid && selectedIds.has(optId(o)));
  const missedValid = validKeys.filter((o) => !selectedIds.has(optId(o)));
  const playedSet = new Set(chordNames);

  return (
    <div className="mt-8 flex flex-col gap-5" data-testid="reveal">
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: '0.22em',
          color: wasCorrect ? 'var(--color-accent)' : 'var(--color-ink)',
        }}
      >
        {wasCorrect ? '✓ Correct' : '✗ Not quite'}
      </div>

      <div className="flex flex-col gap-3">
        {validKeys.map((k) => {
          const field = getHarmonicField(k.root, k.mode);
          return (
            <div
              key={optId(k)}
              className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6"
              style={{
                borderTop: '1px solid var(--color-rule)',
                paddingTop: 10,
              }}
            >
              <div
                className="serif"
                style={{
                  fontSize: 22,
                  color: 'var(--color-accent)',
                  minWidth: 140,
                }}
              >
                {keyLabel(k)}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {field.map((d, i) => {
                  const played = playedSet.has(d.chordName);
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center"
                      data-played={played ? 'true' : 'false'}
                      style={{
                        minWidth: 48,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: played
                          ? 'var(--color-paper-2)'
                          : 'transparent',
                      }}
                    >
                      <span
                        className="serif"
                        style={{
                          fontSize: 20,
                          color: played
                            ? 'var(--color-ink)'
                            : 'var(--color-ink-2)',
                        }}
                      >
                        {d.displayName}
                      </span>
                      <span
                        className="font-mono uppercase mt-0.5"
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.22em',
                          color: played
                            ? 'var(--color-accent)'
                            : 'var(--color-ink-2)',
                        }}
                      >
                        {d.numeral}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {(wrongPicks.length > 0 || missedValid.length > 0) && (
        <div className="flex flex-col gap-1.5">
          {wrongPicks.map((opt) => {
            const degrees = degreesForKey(chordNames, opt);
            const foreign = degrees.find((d) => d.numeral === null);
            return (
              <p
                key={optId(opt)}
                style={{ fontSize: 13, color: 'var(--color-ink-2)' }}
              >
                <span style={{ color: 'var(--color-ink)' }}>
                  {keyLabel(opt)}
                </span>{' '}
                doesn't fit —{' '}
                <span style={{ color: 'var(--color-ink)' }}>
                  {foreign?.chord ?? '?'}
                </span>{' '}
                isn't diatonic to this key.
              </p>
            );
          })}
          {missedValid.map((opt) => (
            <p
              key={optId(opt)}
              style={{ fontSize: 13, color: 'var(--color-ink-2)' }}
            >
              Missed —{' '}
              <span style={{ color: 'var(--color-accent)' }}>
                {keyLabel(opt)}
              </span>{' '}
              is also valid for this progression.
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-2">
        {!wasCorrect && (
          <ForgeButton variant="ghost" arrow={false} onClick={onTryAgain}>
            Try again
          </ForgeButton>
        )}
        <ForgeButton variant="accent" onClick={onNext}>
          Next exercise
        </ForgeButton>
      </div>
    </div>
  );
};

export default Reveal;
