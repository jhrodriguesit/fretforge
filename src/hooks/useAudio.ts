import { useCallback, useState } from 'react';
import * as audioEngine from '../utils/audioEngine';

export const useAudio = () => {
  const [isReady, setIsReady] = useState(false);

  const playChord = useCallback(async (notes: string[]) => {
    await audioEngine.ensureAudioContext();
    setIsReady(true);
    audioEngine.playChord(notes);
  }, []);

  return { playChord, isReady };
};
