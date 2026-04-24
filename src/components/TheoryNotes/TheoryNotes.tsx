import type { Note, ScaleMode } from '../../types/music';
import { SCALE_DISPLAY_NAMES, type ScaleType } from '../../data/scales';
import {
  getIntervalPattern,
  getKeySignature,
  getRelativeKey,
} from '../../utils/musicTheory';

interface TheoryNotesProps {
  selectedRoot: Note;
  scaleMode: ScaleMode;
  scaleType: ScaleType;
}

const formatAccidentals = (
  sharps: string[],
  flats: string[],
): string => {
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
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-surface rounded-2xl border border-border/10 p-8 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
          Theory Note
        </h3>
        <p className="text-text-secondary text-base leading-relaxed">
          The {scaleName} scale follows the interval pattern:{' '}
          <span className="text-text-primary font-bold">{pattern}</span>. For{' '}
          {selectedRoot} {modeLabel(scaleMode)}, {accidentals}.
        </p>
        <p className="text-text-muted text-xs mt-3">
          W = whole step / whole tone (2 frets) · H = half step / semitone (1
          fret) · WH = minor third (3 frets)
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border/10 p-8 shadow-lg">
        <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
          {relativeHeader}
        </h3>
        <p className="text-text-secondary text-base leading-relaxed">
          The {relativeDirection} of {selectedRoot} {modeLabel(scaleMode)} is{' '}
          <span className="text-text-primary font-bold">
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
