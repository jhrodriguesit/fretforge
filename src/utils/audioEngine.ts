import * as Tone from 'tone';

const VOICES = 6;
let voices: Tone.PluckSynth[] | null = null;
let bus: Tone.Gain | null = null;
let nextVoice = 0;

const getVoices = (): Tone.PluckSynth[] => {
  if (!voices) {
    const reverb = new Tone.Reverb({ decay: 2.4, wet: 0.25 }).toDestination();
    const chorus = new Tone.Chorus({
      frequency: 1.2,
      delayTime: 3,
      depth: 0.4,
      wet: 0.25,
    })
      .connect(reverb)
      .start();
    bus = new Tone.Gain(0.6).connect(chorus);

    voices = Array.from({ length: VOICES }, () => {
      const v = new Tone.PluckSynth({
        attackNoise: 0.35,
        dampening: 5500,
        resonance: 0.985,
      });
      v.volume.value = -8;
      v.connect(bus!);
      return v;
    });
  }
  return voices;
};

export const ensureAudioContext = async (): Promise<void> => {
  await Tone.start();
  getVoices();
};

const STRUM_STAGGER = 0.09;

export const playChord = (notes: string[], duration = 2.4): void => {
  if (notes.length === 0) return;
  const vs = getVoices();
  const now = Tone.now();
  notes.forEach((note, i) => {
    const v = vs[nextVoice];
    nextVoice = (nextVoice + 1) % VOICES;
    v.triggerAttackRelease(note, duration, now + i * STRUM_STAGGER);
  });
};
