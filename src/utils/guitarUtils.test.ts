import { describe, it, expect } from 'vitest';
import { getFretRange, getNoteAtFret, getScalePositions } from './guitarUtils';
import { CAGED_SHAPES } from '../data/scales';
import type { Note } from '../data/notes';

describe('getNoteAtFret', () => {
  it('returns open-string notes', () => {
    expect(getNoteAtFret(0, 0)).toBe('E');
    expect(getNoteAtFret(1, 0)).toBe('A');
    expect(getNoteAtFret(2, 0)).toBe('D');
    expect(getNoteAtFret(3, 0)).toBe('G');
    expect(getNoteAtFret(4, 0)).toBe('B');
    expect(getNoteAtFret(5, 0)).toBe('E');
  });

  it('returns correct notes on the low-E string', () => {
    expect(getNoteAtFret(0, 1)).toBe('F');
    expect(getNoteAtFret(0, 3)).toBe('G');
    expect(getNoteAtFret(0, 5)).toBe('A');
    expect(getNoteAtFret(0, 7)).toBe('B');
    expect(getNoteAtFret(0, 12)).toBe('E');
  });

  it('returns correct notes on the A string', () => {
    expect(getNoteAtFret(1, 2)).toBe('B');
    expect(getNoteAtFret(1, 3)).toBe('C');
    expect(getNoteAtFret(1, 7)).toBe('E');
  });

  it('returns correct notes on the B string', () => {
    expect(getNoteAtFret(4, 1)).toBe('C');
    expect(getNoteAtFret(4, 5)).toBe('E');
  });

  it('wraps around at octave', () => {
    expect(getNoteAtFret(0, 12)).toBe('E');
    expect(getNoteAtFret(1, 12)).toBe('A');
    expect(getNoteAtFret(2, 14)).toBe('E');
  });

  it('throws for invalid string or fret', () => {
    expect(() => getNoteAtFret(-1, 0)).toThrow();
    expect(() => getNoteAtFret(6, 0)).toThrow();
    expect(() => getNoteAtFret(0, -1)).toThrow();
  });
});

describe('getScalePositions', () => {
  it('returns positions only containing notes from the scale', () => {
    const positions = getScalePositions('A', 'major', CAGED_SHAPES[0]);
    const aMajor = new Set(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
    expect(positions.length).toBeGreaterThan(0);
    for (const p of positions) {
      expect(aMajor.has(p.note)).toBe(true);
    }
  });

  it('marks root notes with isRoot=true', () => {
    const positions = getScalePositions('A', 'major', CAGED_SHAPES[0]);
    const roots = positions.filter((p) => p.isRoot);
    expect(roots.length).toBeGreaterThan(0);
    for (const r of roots) {
      expect(r.note).toBe('A');
    }
  });

  it('A minor pentatonic yields only A C D E G', () => {
    const allowed = new Set(['A', 'C', 'D', 'E', 'G']);
    for (const shape of CAGED_SHAPES) {
      const positions = getScalePositions('A', 'minorPentatonic', shape);
      expect(positions.length).toBeGreaterThan(0);
      for (const p of positions) {
        expect(allowed.has(p.note)).toBe(true);
      }
    }
  });

  it('C major blues includes the blue note E♭ (D#)', () => {
    const notes = new Set(
      CAGED_SHAPES.flatMap((s) =>
        getScalePositions('C', 'majorBlues', s).map((p) => p.note),
      ),
    );
    expect(notes.has('D#')).toBe(true); // D# = E♭
  });
});

describe('getFretRange', () => {
  it('always spans exactly 8 frets', () => {
    const roots: Note[] = ['A', 'E', 'C', 'F#', 'B', 'G'];
    for (const root of roots) {
      for (const shape of CAGED_SHAPES) {
        const range = getFretRange(shape, root);
        expect(range.endFret - range.startFret).toBe(8);
      }
    }
  });

  it('never returns negative startFret', () => {
    for (const shape of CAGED_SHAPES) {
      const range = getFretRange(shape, 'E');
      expect(range.startFret).toBeGreaterThanOrEqual(0);
    }
  });

  it('centers mid-neck shapes with padding on both sides', () => {
    // C root = fret 8 on low E. Shape 1 spans frets 7-11.
    const { startFret, endFret } = getFretRange(CAGED_SHAPES[0], 'C');
    const shapeStart = 7;
    const shapeEnd = 11;
    expect(startFret).toBeLessThan(shapeStart);
    expect(endFret).toBeGreaterThan(shapeEnd);
    expect(shapeStart - startFret).toBeGreaterThanOrEqual(1);
    expect(endFret - shapeEnd).toBeGreaterThanOrEqual(1);
  });
});
