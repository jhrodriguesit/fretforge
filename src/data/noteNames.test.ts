import { describe, it, expect } from 'vitest';
import { nameToPitchClass } from './noteNames';

describe('nameToPitchClass', () => {
  it('maps naturals to themselves', () => {
    expect(nameToPitchClass('C')).toBe('C');
    expect(nameToPitchClass('F')).toBe('F');
  });

  it('maps flats to sharp pitch class', () => {
    expect(nameToPitchClass('Bb')).toBe('A#');
    expect(nameToPitchClass('Eb')).toBe('D#');
    expect(nameToPitchClass('Ab')).toBe('G#');
    expect(nameToPitchClass('Db')).toBe('C#');
    expect(nameToPitchClass('Gb')).toBe('F#');
  });

  it('maps enharmonic edge cases', () => {
    expect(nameToPitchClass('E#')).toBe('F');
    expect(nameToPitchClass('B#')).toBe('C');
    expect(nameToPitchClass('Cb')).toBe('B');
    expect(nameToPitchClass('Fb')).toBe('E');
  });

  it('maps double sharps', () => {
    expect(nameToPitchClass('Fx')).toBe('G');
  });

  it('throws on unknown input', () => {
    expect(() => nameToPitchClass('H')).toThrow();
  });
});
