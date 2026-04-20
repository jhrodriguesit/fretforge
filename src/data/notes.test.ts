import { describe, it, expect } from 'vitest';
import { CHROMATIC_NOTES } from './notes';

describe('CHROMATIC_NOTES', () => {
  it('has 12 notes', () => {
    expect(CHROMATIC_NOTES).toHaveLength(12);
  });

  it('starts with C and ends with B', () => {
    expect(CHROMATIC_NOTES[0]).toBe('C');
    expect(CHROMATIC_NOTES[11]).toBe('B');
  });

  it('follows chromatic order', () => {
    expect([...CHROMATIC_NOTES]).toEqual([
      'C', 'C#', 'D', 'D#', 'E', 'F',
      'F#', 'G', 'G#', 'A', 'A#', 'B',
    ]);
  });
});
