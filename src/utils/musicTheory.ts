import type { Note } from '../data/notes';
import { getKeySpelling } from '../data/keySignatures';
import { nameToPitchClass, type NoteName } from '../data/noteNames';
import { NUMERALS_BY_MODE, QUALITIES_BY_MODE } from '../data/harmonicField';
import { SCALE_INTERVALS, type ScaleType } from '../data/scales';
import type {
  ChordQuality,
  HarmonicFieldDegree,
  ScaleMode,
} from '../types/music';

const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  major: '',
  minor: 'm',
  diminished: 'dim',
};

export const getChordKey = (root: string, quality: ChordQuality): string =>
  `${root}${QUALITY_SUFFIX[quality]}`;

export const getScale = (root: Note, type: ScaleMode): NoteName[] =>
  getKeySpelling(root, type);

export const getHarmonicField = (
  root: Note,
  mode: ScaleMode,
): HarmonicFieldDegree[] => {
  const spelling = getScale(root, mode);
  const qualities = QUALITIES_BY_MODE[mode];
  const numerals = NUMERALS_BY_MODE[mode];
  return spelling.map((spelledRoot, i) => {
    const quality = qualities[i];
    const pc = nameToPitchClass(spelledRoot);
    return {
      degree: i + 1,
      numeral: numerals[i],
      chordName: getChordKey(pc, quality),
      displayName: getChordKey(spelledRoot, quality),
      quality,
    };
  });
};

const STEP_LABEL: Record<number, string> = { 1: 'H', 2: 'W', 3: 'WH' };

export const getIntervalPattern = (scaleType: ScaleType): string => {
  const intervals = SCALE_INTERVALS[scaleType];
  const steps: string[] = [];
  for (let i = 0; i < intervals.length; i++) {
    const next = i === intervals.length - 1 ? 12 : intervals[i + 1];
    const gap = next - intervals[i];
    steps.push(STEP_LABEL[gap] ?? String(gap));
  }
  return steps.join('-');
};

export const getRelativeKey = (
  root: Note,
  mode: ScaleMode,
): { root: NoteName; mode: ScaleMode } => {
  const spelling = getKeySpelling(root, mode);
  if (mode === 'major') {
    return { root: spelling[5], mode: 'minor' };
  }
  return { root: spelling[2], mode: 'major' };
};

export const getKeySignature = (
  root: Note,
  mode: ScaleMode,
): { sharps: NoteName[]; flats: NoteName[] } => {
  const spelling = getKeySpelling(root, mode);
  const sharps: NoteName[] = [];
  const flats: NoteName[] = [];
  for (const name of spelling) {
    if (name.includes('#')) sharps.push(name);
    else if (name.includes('b') && name.length > 1) flats.push(name);
  }
  return { sharps, flats };
};
