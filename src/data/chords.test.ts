import { describe, it, expect } from 'vitest';
import { CHORD_DATABASE } from './chords';
import { CHROMATIC_NOTES } from './notes';
import { getHarmonicField } from '../utils/musicTheory';

describe('CHORD_DATABASE', () => {
  it('every voicing has arrays of length 6', () => {
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

  it('has at least 2 voicings per chord', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      expect(voicings.length, name).toBeGreaterThanOrEqual(2);
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
        if (baseFret > 1) {
          expect(frets.includes(0), label).toBe(false);
        }
      });
    }
  });

  it('fingers are consistent with frets (no finger on muted/open, every fingered fret has a finger)', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      voicings.forEach((voicing, i) => {
        const label = `${name} voicing ${i}`;
        voicing.frets.forEach((fret, s) => {
          const finger = voicing.fingers[s];
          if (fret <= 0) {
            expect(finger, `${label} string ${s} (fret=${fret})`).toBe(0);
          } else {
            expect(finger, `${label} string ${s} (fret=${fret})`).toBeGreaterThanOrEqual(1);
            expect(finger, `${label} string ${s} (fret=${fret})`).toBeLessThanOrEqual(4);
          }
        });
      });
    }
  });

  it('baseFret equals the lowest fingered fret (open voicings use baseFret=1)', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      voicings.forEach((voicing, i) => {
        const label = `${name} voicing ${i}`;
        const fingered = voicing.frets.filter((f) => f > 0);
        if (fingered.length === 0) return;
        const hasOpen = voicing.frets.includes(0);
        if (hasOpen) {
          expect(voicing.baseFret, label).toBe(1);
        } else {
          expect(voicing.baseFret, label).toBe(Math.min(...fingered));
        }
      });
    }
  });

  it('barres are real: ≥2 strings fretted at the barre fret, all barred strings use finger 1', () => {
    for (const [name, voicings] of Object.entries(CHORD_DATABASE)) {
      voicings.forEach((voicing, i) => {
        if (!voicing.barres) return;
        const label = `${name} voicing ${i}`;
        for (const b of voicing.barres) {
          const atBarre = voicing.frets
            .map((f, s) => (f === b ? s : -1))
            .filter((s) => s !== -1);
          expect(atBarre.length, `${label} barre ${b}`).toBeGreaterThanOrEqual(2);
          for (const s of atBarre) {
            expect(voicing.fingers[s], `${label} barre string ${s}`).toBe(1);
          }
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
