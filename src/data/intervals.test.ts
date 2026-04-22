import { describe, it, expect } from 'vitest';
import { SCALE_INTERVALS } from './intervals';

describe('SCALE_INTERVALS', () => {
  it('major has 7 intervals', () => {
    expect(SCALE_INTERVALS.major).toHaveLength(7);
  });

  it('minor has 7 intervals', () => {
    expect(SCALE_INTERVALS.minor).toHaveLength(7);
  });

  it('all intervals are within 0-11', () => {
    for (const mode of Object.values(SCALE_INTERVALS)) {
      for (const semitone of mode) {
        expect(semitone).toBeGreaterThanOrEqual(0);
        expect(semitone).toBeLessThanOrEqual(11);
      }
    }
  });

  it('starts at 0', () => {
    expect(SCALE_INTERVALS.major[0]).toBe(0);
    expect(SCALE_INTERVALS.minor[0]).toBe(0);
  });
});
