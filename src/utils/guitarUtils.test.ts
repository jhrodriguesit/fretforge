import { describe, it, expect } from 'vitest';
import {
  getFretRange,
  getNoteAtFret,
  getScaleNoteNames,
  getScalePositions,
  voicingToPitches,
} from './guitarUtils';
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

  it('A minor blues includes the blue note ♭5 (D#/E♭)', () => {
    const notes = new Set(
      CAGED_SHAPES.flatMap((s) =>
        getScalePositions('A', 'minorBlues', s).map((p) => p.note),
      ),
    );
    expect(notes.has('D#')).toBe(true);
  });
});

describe('FretboardPosition displayName (key-aware spelling)', () => {
  const collectNames = (root: Note, scaleType: 'major' | 'minor' | 'majorPentatonic' | 'minorPentatonic' | 'minorBlues') =>
    new Set(
      CAGED_SHAPES.flatMap((s) =>
        getScalePositions(root, scaleType, s).map((p) => p.displayName),
      ),
    );

  it('D minor spells the 6th as Bb, never A#', () => {
    const names = collectNames('D', 'minor');
    expect(names.has('Bb')).toBe(true);
    expect(names.has('A#')).toBe(false);
  });

  it('F major spells the 4th as Bb, never A#', () => {
    const names = collectNames('F', 'major');
    expect(names.has('Bb')).toBe(true);
    expect(names.has('A#')).toBe(false);
  });

  it('A major spells accidentals as sharps (C#, F#, G#)', () => {
    const names = collectNames('A', 'major');
    expect(names.has('C#')).toBe(true);
    expect(names.has('F#')).toBe(true);
    expect(names.has('G#')).toBe(true);
    expect(names.has('Db')).toBe(false);
  });

  it('E major spells the 3rd as G# and 7th as D#, not flats', () => {
    const names = collectNames('E', 'major');
    expect(names.has('G#')).toBe(true);
    expect(names.has('D#')).toBe(true);
  });

  it('A minor blues spells ♭5 as Eb (flat of the 5th), not D#', () => {
    const names = collectNames('A', 'minorBlues');
    expect(names.has('Eb')).toBe(true);
    expect(names.has('D#')).toBe(false);
  });

  it('D minor blues spells ♭5 as Ab, not G#', () => {
    const names = collectNames('D', 'minorBlues');
    expect(names.has('Ab')).toBe(true);
    expect(names.has('G#')).toBe(false);
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

describe('voicingToPitches', () => {
  it('maps open Em voicing to E2..E4', () => {
    expect(
      voicingToPitches({
        frets: [0, 2, 2, 0, 0, 0],
        fingers: [0, 2, 3, 0, 0, 0],
        baseFret: 1,
      }),
    ).toEqual(['E2', 'B2', 'E3', 'G3', 'B3', 'E4']);
  });

  it('skips muted strings and starts on the lowest sounded pitch', () => {
    const pitches = voicingToPitches({
      frets: [-1, 3, 5, 5, 5, 3],
      fingers: [0, 1, 3, 4, 2, 1],
      baseFret: 3,
      barres: [3],
    });
    expect(pitches[0]).toBe('C3');
    expect(pitches).toHaveLength(5);
  });

  it('handles barre F at fret 1 with sharp spelling', () => {
    const pitches = voicingToPitches({
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      baseFret: 1,
      barres: [1],
    });
    expect(pitches[0]).toBe('F2');
    expect(pitches[3]).toBe('A3');
  });
});

describe('getScaleNoteNames', () => {
  it('spells G major with a sharp seventh', () => {
    expect(getScaleNoteNames('G', 'major')).toEqual([
      'G',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F#',
    ]);
  });

  it('spells F major with a flat fourth', () => {
    expect(getScaleNoteNames('F', 'major')).toEqual([
      'F',
      'G',
      'A',
      'Bb',
      'C',
      'D',
      'E',
    ]);
  });

  it('includes the correctly spelled flat-5 for A minor blues', () => {
    expect(getScaleNoteNames('A', 'minorBlues')).toEqual([
      'A',
      'C',
      'D',
      'Eb',
      'E',
      'G',
    ]);
  });
});
