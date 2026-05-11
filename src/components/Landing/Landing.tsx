import { useState } from 'react';
import TagLabel from '../shared/TagLabel/TagLabel';
import ForgeButton from '../shared/ForgeButton/ForgeButton';
import Wordmark from '../shared/Wordmark/Wordmark';
import { navTo } from '../../hooks/useHashRoute';

interface SectionCard {
  n: string;
  title: string;
  body: string;
  link: string;
  cta: string;
}

const CARDS: SectionCard[] = [
  {
    n: '01',
    title: 'Harmony',
    body: 'Pick a root note and whether you want major or minor. See the seven chords of the harmonic field — the family of chords that live in that key.',
    link: 'harmony',
    cta: 'Open harmony',
  },
  {
    n: '02',
    title: 'Scales',
    body: 'Pick a root and a scale — major, minor, major or minor pentatonic, or blues. See the five shapes that map it across the neck.',
    link: 'scales',
    cta: 'Open scales',
  },
  {
    n: '03',
    title: 'Ear Training',
    body: 'Listen to a short progression and name the key. Multiple choice, instant reveal of which chord is which degree, streak counter to keep you honest.',
    link: 'ear-training',
    cta: 'Open ear training',
  },
];

const Card = ({ card }: { card: SectionCard }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={() => navTo(card.link)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-pointer text-left flex flex-col justify-between border-0"
      style={{
        background: hover ? 'var(--color-paper-2)' : 'var(--color-paper)',
        padding: 32,
        minHeight: 280,
        transition: 'background .15s',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div>
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--color-ink-2)',
          }}
        >
          {card.n}
        </div>
        <div
          className="serif mt-2.5"
          style={{ fontSize: 40, lineHeight: 1 }}
        >
          {card.title}
        </div>
        <p
          className="mt-3.5"
          style={{
            fontSize: 13,
            color: 'var(--color-ink-2)',
            lineHeight: 1.6,
          }}
        >
          {card.body}
        </p>
      </div>
      <div
        className="font-mono uppercase mt-5"
        style={{
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--color-accent)',
        }}
      >
        {card.cta} →
      </div>
    </button>
  );
};

const Landing = () => (
  <div
    className="min-h-screen flex flex-col"
    style={{ background: 'var(--color-paper)' }}
  >
    {/* Hero */}
    <div
      className="px-10 mx-auto w-full"
      style={{ paddingTop: 80, paddingBottom: 60, maxWidth: 1100 }}
    >
      <TagLabel>A reference for guitar players</TagLabel>
      <h1
        className="serif mt-4"
        style={{
          fontSize: 72,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          maxWidth: 900,
        }}
      >
        Harmony, scales,
        <br />
        and{' '}
        <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>
          the sound
        </span>{' '}
        of theory.
      </h1>
      <p
        className="mt-8"
        style={{
          fontSize: 17,
          color: 'var(--color-ink-2)',
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        FretForge is a simple reference. Pick a key, see the chords that live
        in it. Pick a scale, see the five shapes across the neck. No login, no
        tracking, no fuss — just the information you need when you sit down
        with your guitar.
      </p>
      <div className="mt-9 flex gap-3">
        <ForgeButton onClick={() => navTo('harmony')}>
          Browse harmony
        </ForgeButton>
        <ForgeButton variant="ghost" onClick={() => navTo('scales')}>
          Browse scales
        </ForgeButton>
        <ForgeButton variant="ghost" onClick={() => navTo('ear-training')}>
          Train your ear
        </ForgeButton>
      </div>
    </div>

    {/* Section cards */}
    <div
      className="px-10 mx-auto w-full"
      style={{ maxWidth: 1100, paddingBottom: 80 }}
    >
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
      >
        {CARDS.map((c) => (
          <Card key={c.n} card={c} />
        ))}
      </div>
    </div>

    {/* How to use */}
    <div
      style={{
        borderTop: '1px solid var(--color-rule)',
        background: 'var(--color-paper-2)',
        padding: '60px 40px',
      }}
    >
      <div
        className="mx-auto grid gap-12"
        style={{
          maxWidth: 1100,
          gridTemplateColumns: '1fr 2fr',
        }}
      >
        <div>
          <TagLabel>How to use it</TagLabel>
          <h2
            className="serif mt-2.5"
            style={{ fontSize: 32, lineHeight: 1.1 }}
          >
            A reference, not a{' '}
            <span style={{ fontStyle: 'italic' }}>course.</span>
          </h2>
        </div>
        <div
          style={{
            fontSize: 14,
            color: 'var(--color-ink-2)',
            lineHeight: 1.7,
          }}
        >
          Got a song in the key of G? Open harmony, pick G major, see the seven
          chords you have to work with. Want to solo over it? Open scales, pick
          G major pentatonic, pick a shape near where your hand already is.
          <br />
          <br />
          Nothing fancy. Nothing to sign up for. Bookmark it and come back
          whenever you need to check a shape or remember which chord is the iv
          of E minor.
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer
      className="px-10 flex justify-between items-center"
      style={{
        padding: '32px 40px',
        borderTop: '1px solid var(--color-rule)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-2)',
      }}
    >
      <Wordmark size={20} fontSize={18} />
      <span>A reference · 2026</span>
    </footer>
  </div>
);

export default Landing;
