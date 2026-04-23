import { describe, it, expect } from 'vitest';
import { CAGED_SHAPES, SCALE_INTERVALS } from './scales';

describe('CAGED_SHAPES', () => {
  it('defines exactly 5 shapes', () => {
    expect(CAGED_SHAPES).toHaveLength(5);
  });

  it('numbers shapes 1 through 5', () => {
    expect(CAGED_SHAPES.map((s) => s.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('each shape has a valid fret range (startOffset < endOffset)', () => {
    for (const shape of CAGED_SHAPES) {
      expect(shape.endOffset).toBeGreaterThan(shape.startOffset);
    }
  });
});

describe('SCALE_INTERVALS', () => {
  it('defines six scale types', () => {
    expect(Object.keys(SCALE_INTERVALS).sort()).toEqual([
      'major',
      'majorBlues',
      'majorPentatonic',
      'minor',
      'minorBlues',
      'minorPentatonic',
    ]);
  });

  it('every scale starts on the root (0)', () => {
    for (const intervals of Object.values(SCALE_INTERVALS)) {
      expect(intervals[0]).toBe(0);
    }
  });

  it('every interval stays within a single octave', () => {
    for (const intervals of Object.values(SCALE_INTERVALS)) {
      for (const i of intervals) {
        expect(i).toBeGreaterThanOrEqual(0);
        expect(i).toBeLessThan(12);
      }
    }
  });

  it('has the expected note counts', () => {
    expect(SCALE_INTERVALS.major).toHaveLength(7);
    expect(SCALE_INTERVALS.minor).toHaveLength(7);
    expect(SCALE_INTERVALS.majorPentatonic).toHaveLength(5);
    expect(SCALE_INTERVALS.minorPentatonic).toHaveLength(5);
    expect(SCALE_INTERVALS.majorBlues).toHaveLength(6);
    expect(SCALE_INTERVALS.minorBlues).toHaveLength(6);
  });
});
