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

const Header = ({ active }: HeaderProps) => (
  <header
    className="flex items-center justify-between px-10 py-5"
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
    <nav className="flex items-center gap-8 text-sm">
      {ITEMS.map(([path, label]) => {
        const isActive = active === path;
        return (
          <button
            key={path}
            type="button"
            onClick={() => navTo(path)}
            className="cursor-pointer bg-transparent border-0 p-0"
            style={{
              color: isActive ? 'var(--color-accent)' : 'var(--color-ink-2)',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  </header>
);

export default Header;
