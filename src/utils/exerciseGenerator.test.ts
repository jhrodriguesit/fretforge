import { describe, it, expect } from 'vitest';
import {
  EXERCISE_TEMPLATES,
  degreesForKey,
  displayNamesForKey,
  findNearMissDistractors,
  findValidKeys,
  generateRound,
  type KeyChoice,
} from './exerciseGenerator';

// Deterministic RNG (mulberry32) for reproducible round generation.
const seeded = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const keyId = (k: KeyChoice) => `${k.root}|${k.mode}`;

describe('EXERCISE_TEMPLATES', () => {
  it('contains only 3-4 chord templates with 3-4 distinct chords', () => {
    expect(EXERCISE_TEMPLATES.length).toBeGreaterThan(0);
    for (const { template } of EXERCISE_TEMPLATES) {
      expect(template.numerals.length).toBeGreaterThanOrEqual(3);
      expect(template.numerals.length).toBeLessThanOrEqual(4);
      const distinct = new Set(template.numerals).size;
      expect(distinct).toBeGreaterThanOrEqual(3);
      expect(distinct).toBeLessThanOrEqual(4);
    }
  });

  it('excludes the 12-bar entries', () => {
    const ids = EXERCISE_TEMPLATES.map(({ template }) => template.id);
    expect(ids).not.toContain('twelve-bar-blues');
    expect(ids).not.toContain('twelve-bar-minor');
  });
});

describe('findValidKeys', () => {
  it('I-V-vi-IV in C major matches C major AND A minor', () => {
    const valid = findValidKeys(['C', 'G', 'Am', 'F']);
    const ids = valid.map(keyId);
    expect(ids).toContain('C|major');
    expect(ids).toContain('A|minor');
  });

  it('excludes keys missing any chord', () => {
    const valid = findValidKeys(['C', 'G', 'Am', 'F']);
    const ids = valid.map(keyId);
    expect(ids).not.toContain('F|major'); // F major has Gm, not G
    expect(ids).not.toContain('G|major'); // G major has F#dim, not F
  });

  it('handles a minor progression: i-bVII-bVI-bVII (A minor)', () => {
    const valid = findValidKeys(['Am', 'G', 'F', 'G']);
    const ids = valid.map(keyId);
    expect(ids).toContain('A|minor');
    expect(ids).toContain('C|major');
  });

  it('handles a key whose spelling uses flats (F major)', () => {
    // F major harmonic field: F Gm Am Bb C Dm Edim — chord pitch-class names
    // use sharps in the database (A# for Bb). Validity must still match.
    const field = ['F', 'C', 'Dm', 'A#']; // I V vi IV in F major
    const valid = findValidKeys(field);
    const ids = valid.map(keyId);
    expect(ids).toContain('F|major');
    expect(ids).toContain('D|minor');
  });
});

describe('findNearMissDistractors', () => {
  it('returns keys with overlap = N-1 (near-misses) when available', () => {
    const chordNames = ['C', 'G', 'Am', 'F'];
    const valid = findValidKeys(chordNames);
    const distractors = findNearMissDistractors(chordNames, valid, 2, seeded(1));
    expect(distractors.length).toBe(2);
    for (const d of distractors) {
      // Not in valid set
      expect(valid.map(keyId)).not.toContain(keyId(d));
    }
  });

  it('never returns keys from excludeKeys', () => {
    const chordNames = ['C', 'G', 'Am', 'F'];
    const valid = findValidKeys(chordNames);
    const excludedIds = new Set(valid.map(keyId));
    const distractors = findNearMissDistractors(
      chordNames,
      valid,
      4,
      seeded(42),
    );
    for (const d of distractors) {
      expect(excludedIds.has(keyId(d))).toBe(false);
    }
  });

  it('fills with smaller-overlap keys when near-misses are scarce', () => {
    // A 3-chord set with broad overlap shouldn't run out
    const chordNames = ['C', 'G', 'F'];
    const valid = findValidKeys(chordNames);
    const distractors = findNearMissDistractors(
      chordNames,
      valid,
      4,
      seeded(7),
    );
    expect(distractors.length).toBe(4);
  });

  it('returns 0 distractors when count is 0', () => {
    expect(
      findNearMissDistractors(['C', 'G', 'Am', 'F'], [], 0, seeded(1)),
    ).toEqual([]);
  });
});

describe('degreesForKey', () => {
  it('returns correct numerals for the true key', () => {
    const result = degreesForKey(['C', 'G', 'Am', 'F'], {
      root: 'C',
      mode: 'major',
    });
    expect(result).toEqual([
      { chord: 'C', numeral: 'I' },
      { chord: 'G', numeral: 'V' },
      { chord: 'Am', numeral: 'vi' },
      { chord: 'F', numeral: 'IV' },
    ]);
  });

  it('returns correct numerals for the relative minor', () => {
    const result = degreesForKey(['C', 'G', 'Am', 'F'], {
      root: 'A',
      mode: 'minor',
    });
    expect(result.map((r) => r.numeral)).toEqual(['♭III', '♭VII', 'i', '♭VI']);
  });

  it('returns null for foreign chords', () => {
    const result = degreesForKey(['C', 'G', 'Am', 'F'], {
      root: 'F',
      mode: 'major',
    });
    // F major has Gm not G — so G is foreign
    const gEntry = result.find((r) => r.chord === 'G');
    expect(gEntry?.numeral).toBeNull();
  });
});

describe('displayNamesForKey', () => {
  it('uses flat spelling in flat keys', () => {
    // In F major: A# pitch-class = Bb display
    const display = displayNamesForKey(['F', 'C', 'Dm', 'A#'], {
      root: 'F',
      mode: 'major',
    });
    expect(display).toEqual(['F', 'C', 'Dm', 'Bb']);
  });

  it('falls back to chord name if foreign', () => {
    const display = displayNamesForKey(['G'], { root: 'F', mode: 'major' });
    expect(display).toEqual(['G']);
  });
});

describe('generateRound', () => {
  it('returns a well-formed round', () => {
    const round = generateRound(seeded(123));
    expect(round.chordNames.length).toBeGreaterThanOrEqual(3);
    expect(round.chordNames.length).toBeLessThanOrEqual(4);
    expect(round.displayNames.length).toBe(round.chordNames.length);
    expect(round.options.length).toBe(4);
    expect(round.validKeys.length).toBeGreaterThan(0);
  });

  it('includes the true key in validKeys', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const round = generateRound(seeded(seed));
      const ids = round.validKeys.map(keyId);
      expect(ids).toContain(keyId(round.trueKey));
    }
  });

  it("options' isValid flags exactly match findValidKeys output", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const round = generateRound(seeded(seed));
      const validIds = new Set(round.validKeys.map(keyId));
      for (const opt of round.options) {
        const expected = validIds.has(keyId(opt));
        expect(opt.isValid).toBe(expected);
      }
    }
  });

  it('is deterministic given the same seed', () => {
    const a = generateRound(seeded(99));
    const b = generateRound(seeded(99));
    expect(a.chordNames).toEqual(b.chordNames);
    expect(a.trueKey).toEqual(b.trueKey);
    expect(a.options.map(keyId)).toEqual(b.options.map(keyId));
  });

  it('displayNames respect key-aware spelling', () => {
    // Generate many rounds; any time trueKey is F-major, displayNames should
    // never contain "A#" — it should be "Bb".
    let sawFlatKey = false;
    for (let seed = 1; seed <= 200; seed++) {
      const round = generateRound(seeded(seed));
      const key = round.trueKey;
      if (key.root === 'F' && key.mode === 'major') {
        sawFlatKey = true;
        for (const name of round.displayNames) {
          expect(name).not.toMatch(/^A#/);
        }
      }
    }
    expect(sawFlatKey).toBe(true);
  });
});
