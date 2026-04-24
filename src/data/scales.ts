export type ScaleType =
  | 'major'
  | 'minor'
  | 'majorPentatonic'
  | 'minorPentatonic'
  | 'minorBlues';

export type ScaleTab =
  | 'major'
  | 'minor'
  | 'majorPentatonic'
  | 'minorPentatonic'
  | 'blues';

export interface ScaleShape {
  id: number;
  /** Offset from the lowest fret where the root appears on the low-E string. */
  startOffset: number;
  endOffset: number;
}

/**
 * Five overlapping CAGED-style shapes covering a 12-fret octave.
 * Offsets are relative to the root's fret position on the low-E string.
 */
export const CAGED_SHAPES: ScaleShape[] = [
  { id: 1, startOffset: -1, endOffset: 3 },
  { id: 2, startOffset: 2, endOffset: 6 },
  { id: 3, startOffset: 4, endOffset: 8 },
  { id: 4, startOffset: 6, endOffset: 10 },
  { id: 5, startOffset: 9, endOffset: 13 },
];

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  minorBlues: [0, 3, 5, 6, 7, 10],
};

export const SCALE_TAB_LABELS: Record<ScaleTab, string> = {
  major: 'Major',
  minor: 'Minor',
  majorPentatonic: 'Major Pentatonic',
  minorPentatonic: 'Minor Pentatonic',
  blues: 'Blues',
};

export const SCALE_DISPLAY_NAMES: Record<ScaleType, string> = {
  major: 'Major',
  minor: 'Minor',
  majorPentatonic: 'Major Pentatonic',
  minorPentatonic: 'Minor Pentatonic',
  minorBlues: 'Blues',
};
