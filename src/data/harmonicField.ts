import type { ChordQuality, ScaleMode } from '../types/music';

export const QUALITIES_BY_MODE: Record<ScaleMode, ChordQuality[]> = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
};

export const NUMERALS_BY_MODE: Record<ScaleMode, string[]> = {
  major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  minor: ['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII'],
};
