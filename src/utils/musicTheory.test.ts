import { describe, it, expect } from 'vitest';
import { getScale, getHarmonicField, getChordKey } from './musicTheory';

describe('getChordKey', () => {
  it('major has no suffix', () => {
    expect(getChordKey('C', 'major')).toBe('C');
  });
  it('minor uses "m"', () => {
    expect(getChordKey('A', 'minor')).toBe('Am');
  });
  it('diminished uses "dim"', () => {
    expect(getChordKey('G#', 'diminished')).toBe('G#dim');
  });
});

describe('getScale', () => {
  it('C major', () => {
    expect(getScale('C', 'major')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
  it('A minor', () => {
    expect(getScale('A', 'minor')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });
  it('G major', () => {
    expect(getScale('G', 'major')).toEqual([
      'G',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F#',
    ]);
  });
  it('E minor', () => {
    expect(getScale('E', 'minor')).toEqual([
      'E',
      'F#',
      'G',
      'A',
      'B',
      'C',
      'D',
    ]);
  });
});

describe('getHarmonicField', () => {
  it('returns 7 degrees', () => {
    expect(getHarmonicField('A', 'major')).toHaveLength(7);
  });

  it('C major[0] is I/C/major', () => {
    expect(getHarmonicField('C', 'major')[0]).toEqual({
      degree: 1,
      numeral: 'I',
      chordName: 'C',
      quality: 'major',
    });
  });

  it('A major chord names', () => {
    const names = getHarmonicField('A', 'major').map((d) => d.chordName);
    expect(names).toEqual(['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim']);
  });

  it('A minor chord names', () => {
    const names = getHarmonicField('A', 'minor').map((d) => d.chordName);
    expect(names).toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
  });

  it('G major chord names', () => {
    const names = getHarmonicField('G', 'major').map((d) => d.chordName);
    expect(names).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']);
  });

  it('E minor chord names', () => {
    const names = getHarmonicField('E', 'minor').map((d) => d.chordName);
    expect(names).toEqual(['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D']);
  });
});
