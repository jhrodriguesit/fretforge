import { describe, it, expect } from 'vitest';
import { QUALITIES_BY_MODE, NUMERALS_BY_MODE } from './harmonicField';

describe('QUALITIES_BY_MODE', () => {
  it('major qualities are [major, minor, minor, major, major, minor, diminished]', () => {
    expect(QUALITIES_BY_MODE.major).toEqual([
      'major',
      'minor',
      'minor',
      'major',
      'major',
      'minor',
      'diminished',
    ]);
  });

  it('minor qualities are [minor, diminished, major, minor, minor, major, major]', () => {
    expect(QUALITIES_BY_MODE.minor).toEqual([
      'minor',
      'diminished',
      'major',
      'minor',
      'minor',
      'major',
      'major',
    ]);
  });
});

describe('NUMERALS_BY_MODE', () => {
  it('has 7 numerals per mode', () => {
    expect(NUMERALS_BY_MODE.major).toHaveLength(7);
    expect(NUMERALS_BY_MODE.minor).toHaveLength(7);
  });
});
