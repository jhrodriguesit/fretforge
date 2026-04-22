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
    expect(getScale('G', 'major')).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
  });
  it('E minor', () => {
    expect(getScale('E', 'minor')).toEqual(['E', 'F#', 'G', 'A', 'B', 'C', 'D']);
  });
  it('F major uses Bb, not A#', () => {
    expect(getScale('F', 'major')).toEqual(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
  });
  it('D minor uses Bb, not A#', () => {
    expect(getScale('D', 'minor')).toEqual(['D', 'E', 'F', 'G', 'A', 'Bb', 'C']);
  });
});

describe('getHarmonicField', () => {
  it('returns 7 degrees', () => {
    expect(getHarmonicField('A', 'major')).toHaveLength(7);
  });

  it('C major[0]', () => {
    const d = getHarmonicField('C', 'major')[0];
    expect(d).toMatchObject({
      degree: 1,
      numeral: 'I',
      chordName: 'C',
      displayName: 'C',
      quality: 'major',
    });
  });

  it('A major display names', () => {
    const names = getHarmonicField('A', 'major').map((d) => d.displayName);
    expect(names).toEqual(['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim']);
  });

  it('A minor display names', () => {
    const names = getHarmonicField('A', 'minor').map((d) => d.displayName);
    expect(names).toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
  });

  it('G major display names', () => {
    const names = getHarmonicField('G', 'major').map((d) => d.displayName);
    expect(names).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']);
  });

  it('E minor display names', () => {
    const names = getHarmonicField('E', 'minor').map((d) => d.displayName);
    expect(names).toEqual(['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D']);
  });

  it('D minor uses Bb for flat VI (regression: no duplicate letter A)', () => {
    const names = getHarmonicField('D', 'minor').map((d) => d.displayName);
    expect(names).toEqual(['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C']);
    const letters = names.map((n) => n[0]);
    expect(new Set(letters).size).toBe(7);
  });

  it('F major uses Bb', () => {
    const names = getHarmonicField('F', 'major').map((d) => d.displayName);
    expect(names).toEqual(['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim']);
  });

  it('A# root in major mode is spelled as Bb major; chord lookup keys stay sharp', () => {
    const field = getHarmonicField('A#', 'major');
    expect(field.map((d) => d.displayName)).toEqual([
      'Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim',
    ]);
    expect(field.map((d) => d.chordName)).toEqual([
      'A#', 'Cm', 'Dm', 'D#', 'F', 'Gm', 'Adim',
    ]);
  });

  it('D# root in minor mode is spelled as Eb minor', () => {
    const names = getHarmonicField('D#', 'minor').map((d) => d.displayName);
    expect(names).toEqual(['Ebm', 'Fdim', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db']);
  });

  it('minor numerals include flat accidentals', () => {
    const numerals = getHarmonicField('A', 'minor').map((d) => d.numeral);
    expect(numerals).toEqual(['i', 'ii°', '♭III', 'iv', 'v', '♭VI', '♭VII']);
  });
});
