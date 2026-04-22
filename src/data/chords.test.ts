import { describe, it, expect } from 'vitest';
import { CHORD_DATABASE } from './chords';
import { CHROMATIC_NOTES } from './notes';
import { getHarmonicField } from '../utils/musicTheory';

describe('CHORD_DATABASE', () => {
  it('every voicing has a frets array of length 6', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      for (const voicing of voicings) {
        expect(voicing.frets, name).toHaveLength(6);
        expect(voicing.fingers, name).toHaveLength(6);
      }
    }
  });

  it('all fret values are between -1 and 24', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      for (const voicing of voicings) {
        for (const fret of voicing.frets) {
          expect(fret, name).toBeGreaterThanOrEqual(-1);
          expect(fret, name).toBeLessThanOrEqual(24);
        }
      }
    }
  });

  it('has at least 3 voicings per chord', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      expect(voicings.length, name).toBeGreaterThanOrEqual(3);
    }
  });

  it('all fingered frets fit in the 4-fret display window', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      voicings.forEach((voicing, i) => {
        const label = `${name} voicing ${i}`;
        const { frets, baseFret } = voicing;
        for (const fret of frets) {
          if (fret <= 0) continue;
          expect(fret, label).toBeGreaterThanOrEqual(baseFret);
          expect(fret, label).toBeLessThanOrEqual(baseFret + 3);
        }
        // Open strings are only valid when baseFret is 1
        if (baseFret > 1) {
          expect(frets.includes(0), label).toBe(false);
        }
      });
    }
  });

  it('covers every chord referenced in any key x mode harmonic field', () => {
    for (const root of CHROMATIC_NOTES) {
      for (const mode of ['major', 'minor'] as const) {
        const field = getHarmonicField(root, mode);
        for (const degree of field) {
          expect(CHORD_DATABASE[degree.chordName], degree.chordName).toBeDefined();
        }
      }
    }
  });
});
