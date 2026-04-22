import type { ChordVoicing } from '../types/music';

/**
 * Fret ordering: [low-E, A, D, G, B, high-E]. -1 = muted, 0 = open.
 * Each voicing's fingered frets must stay within baseFret..baseFret+3.
 * Open strings (fret 0) are only valid when baseFret === 1.
 */

const v = (
  frets: number[],
  fingers: number[],
  baseFret = 1,
  barres?: number[],
): ChordVoicing => ({ frets, fingers, baseFret, ...(barres ? { barres } : {}) });

// E-shape major barre at fret N (root on low E)
const eShapeMaj = (n: number): ChordVoicing =>
  v([n, n + 2, n + 2, n + 1, n, n], [1, 3, 4, 2, 1, 1], n, [n]);

// E-shape minor barre at fret N
const eShapeMin = (n: number): ChordVoicing =>
  v([n, n + 2, n + 2, n, n, n], [1, 3, 4, 1, 1, 1], n, [n]);

// A-shape major barre at fret N (root on A)
const aShapeMaj = (n: number): ChordVoicing =>
  v([-1, n, n + 2, n + 2, n + 2, n], [0, 1, 3, 4, 2, 1], n, [n]);

// A-shape minor barre at fret N
const aShapeMin = (n: number): ChordVoicing =>
  v([-1, n, n + 2, n + 2, n + 1, n], [0, 1, 3, 4, 2, 1], n, [n]);

// Diminished triad, root on A string at fret N: root, b5, root, b3
const dimAString = (n: number): ChordVoicing => {
  const base = n === 0 ? 1 : n;
  const fingers =
    n === 0 ? [0, 0, 1, 3, 2, 0] : [0, 1, 2, 4, 3, 0];
  return v([-1, n, n + 1, n + 2, n + 1, -1], fingers, base);
};

// Diminished triad, root on low E string at fret N: root, b5, root, b3
const dimEString = (n: number): ChordVoicing => {
  const base = n === 0 ? 1 : n;
  const fingers =
    n === 0 ? [1, 2, 4, 3, 0, 0] : [1, 2, 4, 3, 0, 0];
  return v([n, n + 1, n + 2, n, -1, -1], fingers, base);
};

// dim7 grip (same root, adds 6 = bb7). Root on A string at fret N.
//   x-N-(N+1)-(N-1)-(N+1)-x
// Requires N >= 1. Baseline = N - 1.
const dim7AString = (n: number): ChordVoicing =>
  v(
    [-1, n, n + 1, n - 1, n + 1, -1],
    [0, 2, 3, 1, 4, 0],
    Math.max(1, n - 1),
  );

export const CHORD_DATABASE: Record<string, ChordVoicing[]> = {
  // ---------------- C (root: low-E fret 8, A fret 3) ----------------
  C: [
    v([-1, 3, 2, 0, 1, 0], [0, 3, 2, 0, 1, 0]), // open
    v([-1, 3, 5, 5, 5, 3], [0, 1, 3, 4, 2, 1], 3, [3]), // A-shape at 3
    eShapeMaj(8), // E-shape at 8
  ],
  Cm: [
    aShapeMin(3),
    eShapeMin(8),
    v([-1, -1, 5, 5, 4, 3], [0, 0, 3, 4, 2, 1], 3), // top-4 variant
  ],
  Cdim: [
    dimAString(3),
    dimEString(8),
    dim7AString(3),
  ],

  // ---------------- C# (A fret 4, low-E fret 9) ----------------
  'C#': [
    aShapeMaj(4),
    eShapeMaj(9),
    v([-1, -1, 6, 6, 6, 4], [0, 0, 2, 3, 4, 1], 4), // partial A-shape
  ],
  'C#m': [
    aShapeMin(4),
    eShapeMin(9),
    v([-1, -1, 6, 6, 5, 4], [0, 0, 3, 4, 2, 1], 4),
  ],
  'C#dim': [
    dimAString(4),
    dimEString(9),
    dim7AString(4),
  ],

  // ---------------- D (A fret 5, low-E fret 10) ----------------
  D: [
    v([-1, -1, 0, 2, 3, 2], [0, 0, 0, 1, 3, 2]), // open
    aShapeMaj(5),
    eShapeMaj(10),
  ],
  Dm: [
    v([-1, -1, 0, 2, 3, 1], [0, 0, 0, 2, 3, 1]), // open
    aShapeMin(5),
    eShapeMin(10),
  ],
  Ddim: [
    dimAString(5),
    dimEString(10),
    dim7AString(5),
  ],

  // ---------------- D# / Eb (A fret 6, low-E fret 11) ----------------
  'D#': [
    aShapeMaj(6),
    eShapeMaj(11),
    v([-1, -1, 1, 3, 4, 3], [0, 0, 1, 2, 4, 3]), // D-shape
  ],
  'D#m': [
    aShapeMin(6),
    eShapeMin(11),
    v([-1, -1, 1, 3, 4, 2], [0, 0, 1, 3, 4, 2]),
  ],
  'D#dim': [
    dimAString(6),
    dimEString(11),
    dim7AString(6),
  ],

  // ---------------- E (low-E fret 0, A fret 7) ----------------
  E: [
    v([0, 2, 2, 1, 0, 0], [0, 2, 3, 1, 0, 0]), // open
    aShapeMaj(7),
    eShapeMaj(12),
  ],
  Em: [
    v([0, 2, 2, 0, 0, 0], [0, 2, 3, 0, 0, 0]), // open
    aShapeMin(7),
    eShapeMin(12),
  ],
  Edim: [
    dimEString(0),
    dimAString(7),
    dim7AString(7),
  ],

  // ---------------- F (low-E fret 1, A fret 8) ----------------
  F: [
    eShapeMaj(1),
    v([-1, -1, 3, 2, 1, 1], [0, 0, 4, 3, 1, 2], 1, [1]), // top-4 partial F
    aShapeMaj(8),
  ],
  Fm: [
    eShapeMin(1),
    v([-1, -1, 3, 1, 1, 1], [0, 0, 3, 1, 1, 1], 1, [1]),
    aShapeMin(8),
  ],
  Fdim: [
    dimEString(1),
    dimAString(8),
    dim7AString(8),
  ],

  // ---------------- F# (low-E fret 2, A fret 9) ----------------
  'F#': [
    eShapeMaj(2),
    aShapeMaj(9),
    v([-1, -1, 4, 3, 2, 2], [0, 0, 4, 3, 1, 2], 2, [2]),
  ],
  'F#m': [
    eShapeMin(2),
    aShapeMin(9),
    v([-1, -1, 4, 2, 2, 2], [0, 0, 3, 1, 1, 1], 2, [2]),
  ],
  'F#dim': [
    dimEString(2),
    dimAString(9),
    dim7AString(9),
  ],

  // ---------------- G (low-E fret 3, A fret 10) ----------------
  G: [
    v([3, 2, 0, 0, 0, 3], [2, 1, 0, 0, 0, 3]), // open
    eShapeMaj(3),
    aShapeMaj(10),
  ],
  Gm: [
    eShapeMin(3),
    aShapeMin(10),
    v([-1, -1, 5, 3, 3, 3], [0, 0, 3, 1, 1, 1], 3, [3]),
  ],
  Gdim: [
    dimEString(3),
    dimAString(10),
    dim7AString(10),
  ],

  // ---------------- G# (low-E fret 4, A fret 11) ----------------
  'G#': [
    eShapeMaj(4),
    aShapeMaj(11),
    v([-1, -1, 6, 5, 4, 4], [0, 0, 4, 3, 1, 2], 4, [4]),
  ],
  'G#m': [
    eShapeMin(4),
    aShapeMin(11),
    v([-1, -1, 6, 4, 4, 4], [0, 0, 3, 1, 1, 1], 4, [4]),
  ],
  'G#dim': [
    dimEString(4),
    dimAString(11),
    dim7AString(11),
  ],

  // ---------------- A (A fret 0/12, low-E fret 5) ----------------
  A: [
    v([-1, 0, 2, 2, 2, 0], [0, 0, 1, 2, 3, 0]), // open
    eShapeMaj(5),
    aShapeMaj(12),
  ],
  Am: [
    v([-1, 0, 2, 2, 1, 0], [0, 0, 2, 3, 1, 0]), // open
    eShapeMin(5),
    aShapeMin(12),
  ],
  Adim: [
    dimAString(0),
    dimEString(5),
    dim7AString(12),
  ],

  // ---------------- A# / Bb (A fret 1, low-E fret 6) ----------------
  'A#': [
    aShapeMaj(1),
    eShapeMaj(6),
    v([-1, -1, 3, 3, 3, 1], [0, 0, 2, 3, 4, 1], 1, [1]),
  ],
  'A#m': [
    aShapeMin(1),
    eShapeMin(6),
    v([-1, -1, 3, 3, 2, 1], [0, 0, 3, 4, 2, 1], 1),
  ],
  'A#dim': [
    dimAString(1),
    dimEString(6),
    dim7AString(1),
  ],

  // ---------------- B (A fret 2, low-E fret 7) ----------------
  B: [
    aShapeMaj(2),
    eShapeMaj(7),
    v([-1, -1, 4, 4, 4, 2], [0, 0, 2, 3, 4, 1], 2, [2]),
  ],
  Bm: [
    aShapeMin(2),
    eShapeMin(7),
    v([-1, -1, 4, 4, 3, 2], [0, 0, 3, 4, 2, 1], 2),
  ],
  Bdim: [
    dimAString(2),
    dimEString(7),
    dim7AString(2),
  ],
};
