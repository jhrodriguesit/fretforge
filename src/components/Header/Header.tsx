import { useState } from 'react';
import Wordmark from '../shared/Wordmark/Wordmark';
import { navTo } from '../../hooks/useHashRoute';

interface HeaderProps {
  active: string;
}

const ITEMS: Array<[string, string]> = [
  ['harmony', 'Harmony'],
  ['scales', 'Scales'],
  ['ear-training', 'Ear Training'],
];

const BurgerIcon = () => (
  <svg width="24" height="18" viewBox="0 0 24 18" aria-hidden="true" fill="var(--color-ink)">
    <rect x="0" y="0" width="24" height="2" rx="1" />
    <rect x="0" y="8" width="24" height="2" rx="1" />
    <rect x="0" y="16" width="24" height="2" rx="1" />
  </svg>
);

const Header = ({ active }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  const navStyle = (path: string) => ({
    color: active === path ? 'var(--color-accent)' : 'var(--color-ink-2)',
    fontWeight: active === path ? 600 : 400,
  });

  return (
    <>
      <header
        className="relative flex items-center justify-between px-4 sm:px-10 py-5"
        style={{ borderBottom: '1px solid var(--color-rule)' }}
      >
        <button
          type="button"
          onClick={() => navTo('')}
          className="cursor-pointer bg-transparent border-0 p-0"
          aria-label="FretForge home"
        >
          <Wordmark size={26} fontSize={26} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8 text-sm">
          {ITEMS.map(([path, label]) => (
            <button
              key={path}
              type="button"
              onClick={() => navTo(path)}
              className="cursor-pointer bg-transparent border-0 p-0"
              style={navStyle(path)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile burger button */}
        <button
          type="button"
          className="sm:hidden cursor-pointer bg-transparent border-0 p-0"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <BurgerIcon />
        </button>
      </header>

      {/* Backdrop */}
      <div
        className="sm:hidden fixed inset-0 z-40"
        style={{
          background: 'rgba(26, 23, 20, 0.25)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in drawer */}
      <nav
        className="sm:hidden fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: '240px',
          background: 'var(--color-paper-2)',
          borderLeft: '2px solid var(--color-rule)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          paddingTop: '80px',
        }}
        aria-hidden={!open}
      >
        {ITEMS.map(([path, label]) => (
          <button
            key={path}
            type="button"
            onClick={() => { navTo(path); setOpen(false); }}
            className="cursor-pointer bg-transparent border-0 px-6 py-4 text-left text-base"
            style={navStyle(path)}
          >
            {label}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Header;
