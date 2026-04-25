import { useEffect, useMemo, useState } from 'react';
import type { HarmonicFieldDegree, ScaleMode } from '../../types/music';
import {
  PROGRESSION_STYLES,
  getProgressions,
  type ProgressionStyle,
} from '../../data/progressions';
import TagLabel from '../shared/TagLabel/TagLabel';
import ChipGroup from '../shared/ChipGroup/ChipGroup';

interface ProgressionsPickerProps {
  scaleMode: ScaleMode;
  numeralToDegree: Map<string, HarmonicFieldDegree>;
}

const ProgressionsPicker = ({
  scaleMode,
  numeralToDegree,
}: ProgressionsPickerProps) => {
  const all = useMemo(() => getProgressions(scaleMode), [scaleMode]);
  const [style, setStyle] = useState<ProgressionStyle>('pop');
  const filtered = useMemo(
    () => all.filter((p) => p.style === style),
    [all, style],
  );
  const [selectedId, setSelectedId] = useState<string>(
    all.find((p) => p.style === 'pop')?.id ?? all[0]?.id ?? '',
  );

  useEffect(() => {
    if (!filtered.find((p) => p.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? '');
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];

  return (
    <div
      className="flex flex-col"
      style={{
        border: '1px dashed var(--color-rule)',
        padding: 18,
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <TagLabel>Progressions to try</TagLabel>

      <div className="mt-2.5">
        <ChipGroup
          options={PROGRESSION_STYLES}
          value={style}
          onChange={setStyle}
        />
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {filtered.map((p) => {
          const active = p.id === selected?.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              aria-pressed={active}
              className="cursor-pointer text-left transition-[filter] hover:brightness-95"
              style={{
                padding: '8px 12px',
                border: '1px solid var(--color-ink)',
                background: active ? 'var(--color-ink)' : 'transparent',
                color: active ? 'var(--color-paper)' : 'var(--color-ink)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                {p.name}
              </div>
              {p.example && (
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 2,
                    color: active
                      ? 'var(--color-paper-2)'
                      : 'var(--color-ink-2)',
                  }}
                >
                  {p.example}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {selected.numerals.map((numeral, i) => {
            const ch = numeralToDegree.get(numeral);
            return (
              <span
                key={i}
                className="serif"
                style={{
                  padding: '6px 10px',
                  background: 'var(--color-paper-2)',
                  fontSize: 18,
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {ch ? ch.displayName : numeral}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgressionsPicker;
