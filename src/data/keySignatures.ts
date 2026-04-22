import type { Note } from './notes';
import type { ScaleMode } from '../types/music';
import type { NoteName } from './noteNames';

export type KeySignatureKey = `${Note}-${ScaleMode}`;

export const KEY_SPELLINGS: Record<KeySignatureKey, NoteName[]> = {
  'C-major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'C#-major': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  'D-major': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  'D#-major': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  'E-major': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  'F-major': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  'F#-major': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
  'G-major': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  'G#-major': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  'A-major': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'A#-major': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  'B-major': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],

  'C-minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'C#-minor': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
  'D-minor': ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'],
  'D#-minor': ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db'],
  'E-minor': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
  'F-minor': ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'],
  'F#-minor': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
  'G-minor': ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'],
  'G#-minor': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
  'A-minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'A#-minor': ['Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab'],
  'B-minor': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
};

export const getKeySpelling = (root: Note, mode: ScaleMode): NoteName[] =>
  KEY_SPELLINGS[`${root}-${mode}`];
