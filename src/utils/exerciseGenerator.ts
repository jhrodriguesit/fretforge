import { CHROMATIC_NOTES, type Note } from '../data/notes';
import type { ScaleMode } from '../types/music';
import {
  PROGRESSIONS_MAJOR,
  PROGRESSIONS_MINOR,
  type Progression,
} from '../data/progressions';
import { getHarmonicField } from './musicTheory';

export interface KeyChoice {
  root: Note;
  mode: ScaleMode;
}

export interface ExerciseOption extends KeyChoice {
  isValid: boolean;
}

export interface ExerciseRound {
  chordNames: string[];
  displayNames: string[];
  trueKey: KeyChoice;
  validKeys: KeyChoice[];
  options: ExerciseOption[];
  templateId: string;
  templateName: string;
}

type Rng = () => number;

const defaultRng: Rng = Math.random;

interface TemplateEntry {
  template: Progression;
  mode: ScaleMode;
}

const ALL_TEMPLATES: TemplateEntry[] = [
  ...PROGRESSIONS_MAJOR.map((t) => ({ template: t, mode: 'major' as ScaleMode })),
  ...PROGRESSIONS_MINOR.map((t) => ({ template: t, mode: 'minor' as ScaleMode })),
];

export const EXERCISE_TEMPLATES: TemplateEntry[] = ALL_TEMPLATES.filter(
  ({ template }) => {
    const len = template.numerals.length;
    const distinct = new Set(template.numerals).size;
    return len >= 3 && len <= 4 && distinct >= 3 && distinct <= 4;
  },
);

const keyId = (k: KeyChoice): string => `${k.root}|${k.mode}`;

const pickRandom = <T>(arr: T[], rng: Rng): T => arr[Math.floor(rng() * arr.length)];

const shuffle = <T>(arr: T[], rng: Rng): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const findValidKeys = (chordNames: string[]): KeyChoice[] => {
  const target = new Set(chordNames);
  const valid: KeyChoice[] = [];
  for (const root of CHROMATIC_NOTES) {
    for (const mode of ['major', 'minor'] as ScaleMode[]) {
      const field = getHarmonicField(root, mode);
      const fieldChords = new Set(field.map((d) => d.chordName));
      let allIn = true;
      for (const c of target) {
        if (!fieldChords.has(c)) {
          allIn = false;
          break;
        }
      }
      if (allIn) valid.push({ root, mode });
    }
  }
  return valid;
};

export const findNearMissDistractors = (
  chordNames: string[],
  excludeKeys: KeyChoice[],
  count: number,
  rng: Rng = defaultRng,
): KeyChoice[] => {
  const target = new Set(chordNames);
  const targetSize = target.size;
  const excluded = new Set(excludeKeys.map(keyId));

  const byOverlap = new Map<number, KeyChoice[]>();
  for (const root of CHROMATIC_NOTES) {
    for (const mode of ['major', 'minor'] as ScaleMode[]) {
      const k: KeyChoice = { root, mode };
      if (excluded.has(keyId(k))) continue;
      const fieldChords = new Set(
        getHarmonicField(root, mode).map((d) => d.chordName),
      );
      let overlap = 0;
      for (const c of target) if (fieldChords.has(c)) overlap++;
      if (overlap === targetSize) continue; // would be a valid key
      const bucket = byOverlap.get(overlap) ?? [];
      bucket.push(k);
      byOverlap.set(overlap, bucket);
    }
  }

  const result: KeyChoice[] = [];
  // Prefer near-misses (overlap = targetSize - 1), then descending overlap.
  const overlapOrder = [...byOverlap.keys()].sort((a, b) => {
    const aDist = Math.abs(a - (targetSize - 1));
    const bDist = Math.abs(b - (targetSize - 1));
    if (aDist !== bDist) return aDist - bDist;
    return b - a; // higher overlap first as fallback
  });

  for (const overlap of overlapOrder) {
    if (result.length >= count) break;
    const bucket = shuffle(byOverlap.get(overlap) ?? [], rng);
    for (const k of bucket) {
      if (result.length >= count) break;
      result.push(k);
    }
  }
  return result;
};

export const degreesForKey = (
  chordNames: string[],
  key: KeyChoice,
): Array<{ chord: string; numeral: string | null }> => {
  const field = getHarmonicField(key.root, key.mode);
  return chordNames.map((chord) => {
    const found = field.find((d) => d.chordName === chord);
    return { chord, numeral: found ? found.numeral : null };
  });
};

export const displayNamesForKey = (
  chordNames: string[],
  key: KeyChoice,
): string[] => {
  const field = getHarmonicField(key.root, key.mode);
  return chordNames.map((chord) => {
    const found = field.find((d) => d.chordName === chord);
    return found ? found.displayName : chord;
  });
};

export const generateRound = (rng: Rng = defaultRng): ExerciseRound => {
  const { template, mode } = pickRandom(EXERCISE_TEMPLATES, rng);
  const root = pickRandom([...CHROMATIC_NOTES], rng);
  const field = getHarmonicField(root, mode);

  const chordNames: string[] = [];
  const displayNames: string[] = [];
  for (const numeral of template.numerals) {
    const degree = field.find((d) => d.numeral === numeral);
    if (!degree) {
      throw new Error(
        `Template ${template.id} numeral ${numeral} not found in ${root} ${mode}`,
      );
    }
    chordNames.push(degree.chordName);
    displayNames.push(degree.displayName);
  }

  const trueKey: KeyChoice = { root, mode };
  const allValid = findValidKeys(chordNames);
  const sortedValid = [
    trueKey,
    ...allValid.filter((k) => keyId(k) !== keyId(trueKey)),
  ];
  const displayedValid = sortedValid.slice(0, 4);

  const distractorCount = Math.max(0, 4 - displayedValid.length);
  const distractors = findNearMissDistractors(
    chordNames,
    sortedValid,
    distractorCount,
    rng,
  );

  const options: ExerciseOption[] = shuffle(
    [
      ...displayedValid.map((k) => ({ ...k, isValid: true })),
      ...distractors.map((k) => ({ ...k, isValid: false })),
    ],
    rng,
  );

  return {
    chordNames,
    displayNames,
    trueKey,
    validKeys: sortedValid,
    options,
    templateId: template.id,
    templateName: template.name,
  };
};
