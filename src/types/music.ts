export type ScaleMode = 'major' | 'minor';

export type ChordQuality = 'major' | 'minor' | 'diminished';

export interface ChordVoicing {
  frets: number[];
  fingers: number[];
  barres?: number[];
  baseFret: number;
}

export interface HarmonicFieldDegree {
  degree: number;
  numeral: string;
  chordName: string;
  quality: ChordQuality;
}

export type { Note } from '../data/notes';
