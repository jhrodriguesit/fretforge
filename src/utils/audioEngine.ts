import * as Tone from 'tone';

const SAMPLE_BASE = `${import.meta.env.BASE_URL}samples/guitar-nylon/`;
const SAMPLE_MAP: Record<string, string> = {
  E2: 'E2.mp3',
  A2: 'A2.mp3',
  D3: 'D3.mp3',
  G3: 'G3.mp3',
  B3: 'B3.mp3',
  E4: 'E4.mp3',
  A4: 'A4.mp3',
  D5: 'D5.mp3',
  G5: 'G5.mp3',
};

const STRUM_STAGGER = 0.025;
const STRUM_JITTER = 0.005;
const FADE_OUT = 0.08;

const randomUnit = (): number => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x1_00_00_00_00;
};

type Status = 'idle' | 'loading' | 'ready' | 'failed';

let sampler: Tone.Sampler | null = null;
let status: Status = 'idle';
let loadPromise: Promise<void> | null = null;
const listeners = new Set<(s: Status) => void>();

const setStatus = (s: Status) => {
  status = s;
  listeners.forEach((fn) => fn(s));
};

export const getStatus = (): Status => status;

export const subscribe = (fn: (s: Status) => void): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const ensureAudio = async (): Promise<void> => {
  if (status === 'ready') return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    setStatus('loading');
    try {
      await Tone.start();

      const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.15 }).toDestination();
      await reverb.ready;

      const s = new Tone.Sampler({
        urls: SAMPLE_MAP,
        baseUrl: SAMPLE_BASE,
        release: FADE_OUT,
      }).connect(reverb);

      await Tone.loaded();
      sampler = s;
      setStatus('ready');
    } catch (err) {
      console.error('Audio load failed', err);
      setStatus('failed');
      throw err;
    }
  })();

  return loadPromise;
};

export const playChord = (notes: string[]): void => {
  if (!sampler || status !== 'ready' || notes.length === 0) return;

  const now = Tone.now();
  sampler.releaseAll(now);

  const attackAt = now + FADE_OUT;
  notes.forEach((note, i) => {
    const jitter = (randomUnit() * 2 - 1) * STRUM_JITTER;
    const time = attackAt + i * STRUM_STAGGER + jitter;
    const velocity = 0.75 + randomUnit() * 0.25;
    sampler!.triggerAttack(note, time, velocity);
  });
};
