export const CHROMATIC_NOTES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
] as const;

export type Note = (typeof CHROMATIC_NOTES)[number];
