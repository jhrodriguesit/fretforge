import type { ExerciseOption } from '../../utils/exerciseGenerator';
import { getKeySpelling } from '../../data/keySignatures';

interface KeyOptionsProps {
  options: ExerciseOption[];
  selected: Set<string>;
  disabled: boolean;
  onToggle: (id: string) => void;
  revealed: boolean;
}

const optId = (opt: { root: string; mode: string }) => `${opt.root}|${opt.mode}`;

const KeyOptions = ({
  options,
  selected,
  disabled,
  onToggle,
  revealed,
}: KeyOptionsProps) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {options.map((opt) => {
      const id = optId(opt);
      const isSelected = selected.has(id);
      const rootLabel = getKeySpelling(opt.root, opt.mode)[0];
      const modeLabel = opt.mode === 'major' ? 'Major' : 'Minor';

      let bg = 'transparent';
      let fg = 'var(--color-ink)';
      let border = '1px solid var(--color-ink)';

      if (revealed) {
        if (opt.isValid) {
          bg = 'var(--color-accent)';
          fg = 'var(--color-paper)';
          border = '1px solid var(--color-accent)';
        } else if (isSelected) {
          bg = 'var(--color-paper-2)';
          fg = 'var(--color-ink-2)';
          border = '1px solid var(--color-rule)';
        } else {
          bg = 'transparent';
          fg = 'var(--color-ink-2)';
          border = '1px solid var(--color-rule)';
        }
      } else if (isSelected) {
        bg = 'var(--color-ink)';
        fg = 'var(--color-paper)';
      }

      return (
        <button
          key={id}
          type="button"
          aria-pressed={isSelected}
          aria-label={`${rootLabel} ${modeLabel}`}
          onClick={() => onToggle(id)}
          disabled={disabled}
          className="flex flex-col items-center justify-center transition-colors disabled:cursor-not-allowed"
          style={{
            background: bg,
            color: fg,
            border,
            borderRadius: 'var(--radius-md)',
            padding: '14px 12px',
            cursor: disabled ? 'default' : 'pointer',
          }}
        >
          <span className="serif" style={{ fontSize: 26, lineHeight: 1 }}>
            {rootLabel}
          </span>
          <span
            className="font-mono uppercase mt-1"
            style={{ fontSize: 9, letterSpacing: '0.22em' }}
          >
            {modeLabel}
          </span>
        </button>
      );
    })}
  </div>
);

export default KeyOptions;
