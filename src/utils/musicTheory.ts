import type { Note } from '../data/notes';
import { getKeySpelling } from '../data/keySignatures';
import { nameToPitchClass, type NoteName } from '../data/noteNames';
import { NUMERALS_BY_MODE, QUALITIES_BY_MODE } from '../data/harmonicField';
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
