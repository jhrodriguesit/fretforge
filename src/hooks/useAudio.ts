import { useCallback, useEffect, useState } from 'react';
import * as audioEngine from '../utils/audioEngine';

export const useAudio = () => {
  const [status, setStatus] = useState(audioEngine.getStatus());

  useEffect(() => audioEngine.subscribe(setStatus), []);

  const playChord = useCallback(async (notes: string[]) => {
    try {
      await audioEngine.ensureAudio();
      audioEngine.playChord(notes);
    } catch {
      // status will already be 'failed' via subscriber
    }
  }, []);

  return {
    playChord,
    isReady: status === 'ready',
    isLoading: status === 'loading',
    isFailed: status === 'failed',
  };
};
