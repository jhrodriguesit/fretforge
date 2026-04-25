import type { Note, ScaleMode } from '../../types/music';
import { SCALE_DISPLAY_NAMES, type ScaleType } from '../../data/scales';
import {
  getIntervalPattern,
  getKeySignature,
  getRelativeKey,
} from '../../utils/musicTheory';
import TagLabel from '../shared/TagLabel/TagLabel';

interface TheoryNotesProps {
  selectedRoot: Note;
  scaleMode: ScaleMode;
  scaleType: ScaleType;
}

const formatAccidentals = (sharps: string[], flats: string[]): string => {
  if (sharps.length === 0 && flats.length === 0) {
    return 'this key has no sharps or flats';
  }
  const parts: string[] = [];
  if (sharps.length > 0) {
    const noun = sharps.length === 1 ? 'sharp' : 'sharps';
    parts.push(`${sharps.length} ${noun} (${sharps.join(', ')})`);
  }
  if (flats.length > 0) {
    const noun = flats.length === 1 ? 'flat' : 'flats';
    parts.push(`${flats.length} ${noun} (${flats.join(', ')})`);
  }
  return `this key has ${parts.join(' and ')}`;
};

const modeLabel = (mode: ScaleMode) => (mode === 'major' ? 'Major' : 'minor');

const cardStyle: React.CSSProperties = {
  background: 'var(--color-paper-2)',
  border: '1px solid var(--color-rule)',
  borderRadius: 'var(--radius-md)',
  padding: 28,
};

const TheoryNotes = ({ selectedRoot, scaleMode, scaleType }: TheoryNotesProps) => {
  const scaleName = SCALE_DISPLAY_NAMES[scaleType];
  const pattern = getIntervalPattern(scaleType);
  const { sharps, flats } = getKeySignature(selectedRoot, scaleMode);
  const accidentals = formatAccidentals(sharps, flats);

  const relative = getRelativeKey(selectedRoot, scaleMode);
  const relativeHeader =
    scaleMode === 'major' ? 'Relative Minor' : 'Relative Major';
  const relativeDirection =
    scaleMode === 'major' ? 'relative minor' : 'relative major';

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div style={cardStyle}>
        <TagLabel color="var(--color-accent)">Theory note</TagLabel>
        <h3
          className="serif mt-2"
          style={{ fontSize: 28, lineHeight: 1.05 }}
        >
          The interval pattern.
        </h3>
        <p
          className="mt-3"
          style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-2)' }}
        >
          The {scaleName} scale follows{' '}
          <span
            className="font-mono"
            style={{
              color: 'var(--color-ink)',
              letterSpacing: '0.05em',
              fontWeight: 600,
            }}
          >
            {pattern}
          </span>
          . For {selectedRoot} {modeLabel(scaleMode)}, {accidentals}.
        </p>
        <p
          className="mt-3"
          style={{ fontSize: 11, color: 'var(--color-ink-2)', opacity: 0.75 }}
        >
          W = whole step (2 frets) · H = half step (1 fret) · WH = minor third
          (3 frets)
        </p>
      </div>

      <div style={cardStyle}>
        <TagLabel color="var(--color-accent)">{relativeHeader}</TagLabel>
        <h3
          className="serif mt-2"
          style={{ fontSize: 28, lineHeight: 1.05 }}
        >
          Same notes, different home.
        </h3>
        <p
          className="mt-3"
          style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-2)' }}
        >
          The {relativeDirection} of {selectedRoot} {modeLabel(scaleMode)} is{' '}
          <span
            className="serif"
            style={{ color: 'var(--color-ink)', fontSize: 18 }}
          >
            {relative.root} {modeLabel(relative.mode)}
          </span>
          . They share the same key signature but start on a different tonal
          center.
        </p>
      </div>
    </section>
  );
};

export default TheoryNotes;
