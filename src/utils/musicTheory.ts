import { CHROMATIC_NOTES, type Note } from '../data/notes';
import { SCALE_INTERVALS } from '../data/intervals';
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

export const getScale = (root: Note, type: ScaleMode): string[] => {
  const rootIdx = CHROMATIC_NOTES.indexOf(root);
  return SCALE_INTERVALS[type].map(
    (semitone) => CHROMATIC_NOTES[(rootIdx + semitone) % 12],
  );
};

export const getHarmonicField = (
  root: Note,
  mode: ScaleMode,
): HarmonicFieldDegree[] => {
  const scale = getScale(root, mode);
  const qualities = QUALITIES_BY_MODE[mode];
  const numerals = NUMERALS_BY_MODE[mode];
  return scale.map((note, i) => ({
    degree: i + 1,
    numeral: numerals[i],
    chordName: getChordKey(note, qualities[i]),
    quality: qualities[i],
  }));
};
