import { CHROMATIC_NOTES, type Note } from '../data/notes';
import {
  SCALE_INTERVALS,
  type ScaleShape,
  type ScaleType,
} from '../data/scales';
import { getKeySpelling } from '../data/keySignatures';
import { nameToPitchClass, type NoteName } from '../data/noteNames';
import type { ScaleMode } from '../types/music';

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

export const rootFretOnLowE = (root: Note): number => {
  const rootPc = pitchClassIndex(root);
  const lowEPc = pitchClassIndex('E');
  return (rootPc - lowEPc + 12) % 12;
};

export interface FretboardPosition {
  string: number;
  fret: number;
  note: Note;
  displayName: NoteName;
  isRoot: boolean;
  isBlueNote: boolean;
}

const buildScalePitchSet = (root: Note, scaleType: ScaleType): Set<number> => {
  const rootPc = pitchClassIndex(root);
  return new Set(SCALE_INTERVALS[scaleType].map((i) => (rootPc + i) % 12));
};

const spellingModeFor = (scaleType: ScaleType): ScaleMode =>
  scaleType === 'major' || scaleType === 'majorPentatonic' ? 'major' : 'minor';

const flatOfFifth = (fifth: NoteName): NoteName => {
  if (fifth.endsWith('#')) return fifth.slice(0, -1);
  return `${fifth}b`;
};

const buildScaleSpelling = (
  root: Note,
  scaleType: ScaleType,
): Map<number, NoteName> => {
  const spelling = getKeySpelling(root, spellingModeFor(scaleType));
  const map = new Map<number, NoteName>();
  for (const name of spelling) {
    map.set(pitchClassIndex(nameToPitchClass(name)), name);
  }
  if (scaleType === 'minorBlues') {
    const flatFive = flatOfFifth(spelling[4]);
    map.set(pitchClassIndex(nameToPitchClass(flatFive)), flatFive);
  }
  return map;
};

export const getScalePositionsInRange = (
  root: Note,
  scaleType: ScaleType,
  startFret: number,
  endFret: number,
): FretboardPosition[] => {
  const scalePcs = buildScalePitchSet(root, scaleType);
  const rootPc = pitchClassIndex(root);
  const bluePc = scaleType === 'minorBlues' ? (rootPc + 6) % 12 : -1;
  const spelling = buildScaleSpelling(root, scaleType);

  const positions: FretboardPosition[] = [];
  for (let s = 0; s < 6; s++) {
    for (let f = Math.max(0, startFret); f <= endFret; f++) {
      const note = getNoteAtFret(s, f);
      const pc = pitchClassIndex(note);
      if (scalePcs.has(pc)) {
        positions.push({
          string: s,
          fret: f,
          note,
          displayName: spelling.get(pc) ?? note,
          isRoot: pc === rootPc,
          isBlueNote: pc === bluePc,
        });
      }
    }
  }
  return positions;
};

export const getScalePositions = (
  root: Note,
  scaleType: ScaleType,
  shape: ScaleShape,
): FretboardPosition[] => {
  const rootFret = rootFretOnLowE(root);
  const startFret = Math.max(0, rootFret + shape.startOffset);
  const endFret = rootFret + shape.endOffset;
  return getScalePositionsInRange(root, scaleType, startFret, endFret);
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
