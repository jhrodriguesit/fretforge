import { describe, it, expect } from 'vitest';
import { CHROMATIC_NOTES } from './notes';
import { KEY_SPELLINGS, getKeySpelling } from './keySignatures';
import { nameToPitchClass } from './noteNames';
import { SCALE_INTERVALS } from './intervals';

describe('KEY_SPELLINGS', () => {
  it('covers all 12 roots x 2 modes', () => {
    for (const root of CHROMATIC_NOTES) {
      for (const mode of ['major', 'minor'] as const) {
        const spelling = getKeySpelling(root, mode);
        expect(spelling, `${root}-${mode}`).toHaveLength(7);
      }
    }
  });

  it('each spelling uses 7 distinct letter names', () => {
    for (const [key, spelling] of Object.entries(KEY_SPELLINGS)) {
      const letters = spelling.map((n) => n[0]);
      expect(new Set(letters).size, key).toBe(7);
    }
  });

  it('spelled notes map to the correct pitch classes for each mode', () => {
    const rootIdx = (n: string) =>
      CHROMATIC_NOTES.indexOf(n as (typeof CHROMATIC_NOTES)[number]);
    for (const root of CHROMATIC_NOTES) {
      for (const mode of ['major', 'minor'] as const) {
        const spelling = getKeySpelling(root, mode);
        const pcs = spelling.map(nameToPitchClass);
        const expected = SCALE_INTERVALS[mode].map(
          (st) => CHROMATIC_NOTES[(rootIdx(root) + st) % 12],
        );
        expect(pcs, `${root}-${mode}`).toEqual(expected);
      }
    }
  });

  it('D minor spells the flat VI as Bb', () => {
    expect(getKeySpelling('D', 'minor')).toEqual([
      'D', 'E', 'F', 'G', 'A', 'Bb', 'C',
    ]);
  });

  it('F major is a flat key', () => {
    expect(getKeySpelling('F', 'major')).toEqual([
      'F', 'G', 'A', 'Bb', 'C', 'D', 'E',
    ]);
  });

  it('A# major is spelled as Bb major', () => {
    expect(getKeySpelling('A#', 'major')[0]).toBe('Bb');
  });

  it('D# minor is spelled as Eb minor', () => {
    expect(getKeySpelling('D#', 'minor')[0]).toBe('Eb');
  });
});
