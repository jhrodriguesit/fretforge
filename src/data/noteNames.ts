import type { Note } from './notes';

export type NoteName = string;

const NAME_TO_PC: Record<string, Note> = {
  C: 'C',
  'C#': 'C#',
  Db: 'C#',
  D: 'D',
  'D#': 'D#',
  Eb: 'D#',
  E: 'E',
  Fb: 'E',
  'E#': 'F',
  F: 'F',
  'F#': 'F#',
  Gb: 'F#',
  G: 'G',
  'G#': 'G#',
  Ab: 'G#',
  A: 'A',
  'A#': 'A#',
  Bb: 'A#',
  B: 'B',
  Cb: 'B',
  'B#': 'C',
  Fx: 'G',
  Cx: 'D',
  Gx: 'A',
  Dx: 'E',
};

export const nameToPitchClass = (name: NoteName): Note => {
  const pc = NAME_TO_PC[name];
  if (!pc) throw new Error(`Unknown note name: ${name}`);
  return pc;
};
