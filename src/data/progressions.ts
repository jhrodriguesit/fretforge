import type { ScaleMode } from '../types/music';

export type ProgressionStyle =
  | 'rock'
  | 'pop'
  | 'blues'
  | 'reggae'
  | 'jazz'
  | 'folk';

export interface Progression {
  id: string;
  name: string;
  style: ProgressionStyle;
  example?: string;
  numerals: string[];
}

export const PROGRESSION_STYLES: Array<[ProgressionStyle, string]> = [
  ['rock', 'Rock'],
  ['pop', 'Pop'],
  ['blues', 'Blues'],
  ['reggae', 'Reggae'],
  ['jazz', 'Jazz'],
  ['folk', 'Folk'],
];

export const PROGRESSIONS_MAJOR: Progression[] = [
  {
    id: 'axis-of-awesome',
    name: 'Axis of Awesome',
    style: 'pop',
    example: 'Let It Be — The Beatles',
    numerals: ['I', 'V', 'vi', 'IV'],
  },
  {
    id: 'fifties-doo-wop',
    name: '50s Doo-Wop',
    style: 'pop',
    example: 'Stand By Me — Ben E. King',
    numerals: ['I', 'vi', 'IV', 'V'],
  },
  {
    id: 'sensitive-female',
    name: 'Pop-punk turnaround',
    style: 'pop',
    example: 'Don’t Stop Believin’ — Journey',
    numerals: ['vi', 'IV', 'I', 'V'],
  },
  {
    id: 'rock-anthem',
    name: 'Stadium Rock',
    style: 'rock',
    example: 'With or Without You — U2',
    numerals: ['I', 'V', 'vi', 'IV'],
  },
  {
    id: 'rock-three-chord',
    name: 'Three-Chord Rock',
    style: 'rock',
    example: 'Wild Thing — The Troggs',
    numerals: ['I', 'IV', 'V'],
  },
  {
    id: 'twelve-bar-blues',
    name: '12-Bar Blues (simplified)',
    style: 'blues',
    example: 'Johnny B. Goode — Chuck Berry',
    numerals: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
  },
  {
    id: 'three-chord-blues',
    name: 'Three-Chord Blues',
    style: 'blues',
    example: 'Hound Dog — Elvis Presley',
    numerals: ['I', 'IV', 'V'],
  },
  {
    id: 'one-love',
    name: 'One-Love Skank',
    style: 'reggae',
    example: 'One Love — Bob Marley',
    numerals: ['I', 'V', 'vi', 'IV'],
  },
  {
    id: 'two-chord-skank',
    name: 'Two-Chord Skank',
    style: 'reggae',
    example: 'Three Little Birds — Bob Marley',
    numerals: ['I', 'IV'],
  },
  {
    id: 'two-five-one',
    name: 'ii–V–I',
    style: 'jazz',
    example: 'Autumn Leaves',
    numerals: ['ii', 'V', 'I'],
  },
  {
    id: 'rhythm-changes',
    name: 'Rhythm Changes turnaround',
    style: 'jazz',
    example: 'I Got Rhythm — Gershwin',
    numerals: ['I', 'vi', 'ii', 'V'],
  },
  {
    id: 'folk-classic',
    name: 'Folk Three-Chord',
    style: 'folk',
    example: 'This Land Is Your Land — Woody Guthrie',
    numerals: ['I', 'IV', 'V'],
  },
];

export const PROGRESSIONS_MINOR: Progression[] = [
  {
    id: 'aeolian-descent',
    name: 'Aeolian Descent',
    style: 'rock',
    example: 'All Along the Watchtower — Dylan / Hendrix',
    numerals: ['i', '♭VII', '♭VI', '♭VII'],
  },
  {
    id: 'andalusian',
    name: 'Andalusian Cadence',
    style: 'rock',
    example: 'Hit the Road Jack — Ray Charles',
    numerals: ['i', '♭VII', '♭VI', 'v'],
  },
  {
    id: 'zombie',
    name: 'Modern Minor Loop',
    style: 'pop',
    example: 'Zombie — The Cranberries',
    numerals: ['i', '♭VI', '♭III', '♭VII'],
  },
  {
    id: 'minor-pop-descent',
    name: 'Minor Pop Descent',
    style: 'pop',
    example: 'Save Tonight — Eagle-Eye Cherry',
    numerals: ['i', '♭VII', '♭VI', 'v'],
  },
  {
    id: 'minor-blues',
    name: 'Minor Blues',
    style: 'blues',
    example: 'The Thrill Is Gone — B.B. King',
    numerals: ['i', 'iv', 'v'],
  },
  {
    id: 'twelve-bar-minor',
    name: '12-Bar Minor (simplified)',
    style: 'blues',
    example: 'St. James Infirmary',
    numerals: ['i', 'i', 'i', 'i', 'iv', 'iv', 'i', 'i', 'v', 'iv', 'i', 'v'],
  },
  {
    id: 'reggae-minor-skank',
    name: 'Minor Skank',
    style: 'reggae',
    example: 'Get Up, Stand Up — Bob Marley',
    numerals: ['i', '♭VII'],
  },
  {
    id: 'reggae-i-iv',
    name: 'Roots i–iv',
    style: 'reggae',
    example: 'No Woman, No Cry (verse vibe)',
    numerals: ['i', 'iv'],
  },
  {
    id: 'minor-two-five-one',
    name: 'ii°–v–i',
    style: 'jazz',
    example: 'Blue Bossa',
    numerals: ['ii°', 'v', 'i'],
  },
  {
    id: 'minor-turnaround',
    name: 'Minor Turnaround',
    style: 'jazz',
    example: 'Summertime — Gershwin',
    numerals: ['i', 'iv', '♭VII', '♭III'],
  },
];

export const getProgressions = (mode: ScaleMode): Progression[] =>
  mode === 'major' ? PROGRESSIONS_MAJOR : PROGRESSIONS_MINOR;
