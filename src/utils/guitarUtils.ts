import { CHROMATIC_NOTES, type Note } from '../data/notes';
import {
  SCALE_INTERVALS,
  type ScaleShape,
  type ScaleType,
} from '../data/scales';

/** Standard tuning, low-to-high: E A D G B E. Index = string number. */
const STRING_OPEN_PC: Note[] = ['E', 'A', 'D', 'G', 'B', 'E'];

const FRETBOARD_WINDOW = 8;

const pitchClassIndex = (note: Note): number =>
  CHROMATIC_NOTES.indexOf(note);

/**
 * @param stringIndex 0 = low E ... 5 = high E
 * @param fret 0 = open string
 */
export const getNoteAtFret = (stringIndex: number, fret: number): Note => {
  if (stringIndex < 0 || stringIndex > 5) {
    throw new Error(`Invalid string index: ${stringIndex}`);
  }
  if (fret < 0) {
    throw new Error(`Invalid fret: ${fret}`);
  }
  const open = pitchClassIndex(STRING_OPEN_PC[stringIndex]);
  return CHROMATIC_NOTES[(open + fret) % 12];
};

const rootFretOnLowE = (root: Note): number => {
  const rootPc = pitchClassIndex(root);
  const lowEPc = pitchClassIndex('E');
  return (rootPc - lowEPc + 12) % 12;
};

export interface FretboardPosition {
  string: number;
  fret: number;
  note: Note;
  isRoot: boolean;
}

const buildScalePitchSet = (root: Note, scaleType: ScaleType): Set<number> => {
  const rootPc = pitchClassIndex(root);
  return new Set(SCALE_INTERVALS[scaleType].map((i) => (rootPc + i) % 12));
};

export const getScalePositions = (
  root: Note,
  scaleType: ScaleType,
  shape: ScaleShape,
): FretboardPosition[] => {
  const rootFret = rootFretOnLowE(root);
  const startFret = Math.max(0, rootFret + shape.startOffset);
  const endFret = rootFret + shape.endOffset;
  const scalePcs = buildScalePitchSet(root, scaleType);
  const rootPc = pitchClassIndex(root);

  const positions: FretboardPosition[] = [];
  for (let s = 0; s < 6; s++) {
    for (let f = startFret; f <= endFret; f++) {
      const note = getNoteAtFret(s, f);
      const pc = pitchClassIndex(note);
      if (scalePcs.has(pc)) {
        positions.push({
          string: s,
          fret: f,
          note,
          isRoot: pc === rootPc,
        });
      }
    }
  }
  return positions;
};

/**
 * Fixed 8-fret viewport centered on the shape.
 */
export const getFretRange = (
  shape: ScaleShape,
  root: Note,
): { startFret: number; endFret: number } => {
  const rootFret = rootFretOnLowE(root);
  const shapeStart = rootFret + shape.startOffset;
  const shapeWidth = shape.endOffset - shape.startOffset;
  const pad = Math.floor((FRETBOARD_WINDOW - shapeWidth) / 2);
  const startFret = Math.max(0, shapeStart - pad);
  return { startFret, endFret: startFret + FRETBOARD_WINDOW };
};
