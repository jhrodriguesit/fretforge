interface ChipGroupProps<T extends string> {
  options: Array<[T, string]>;
  value: T;
  onChange: (value: T) => void;
}

const ChipGroup = <T extends string>({
  options,
  value,
  onChange,
}: ChipGroupProps<T>) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map(([val, label]) => {
      const active = val === value;
      return (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          aria-pressed={active}
          className="cursor-pointer transition-[filter] hover:brightness-95"
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-ink)',
            background: active ? 'var(--color-ink)' : 'transparent',
            color: active ? 'var(--color-paper)' : 'var(--color-ink)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default ChipGroup;
