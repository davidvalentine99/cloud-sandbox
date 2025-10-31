import { useState, useRef, useCallback, useEffect } from 'preact/hooks';

/**
 * Hook for playing audio from blob or URL
 * Handles audio queue and playback state
 * @returns {Object} Playback state and controls
 */
export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(null);

  /**
   * Play audio from blob or URL
   * @param {Blob|string} source - Audio blob or URL
   */
  const play = useCallback((source) => {
    console.log('[AudioPlayback] Starting playback, source type:', source instanceof Blob ? 'Blob' : 'URL');

    // Stop current audio if playing
    if (audioRef.current) {
      console.log('[AudioPlayback] Stopping current audio');
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create audio element
    const audioUrl = source instanceof Blob ? URL.createObjectURL(source) : source;
    console.log('[AudioPlayback] Created audio URL:', audioUrl);

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Log audio properties
    if (source instanceof Blob) {
      console.log('[AudioPlayback] Audio blob size:', source.size, 'bytes, type:', source.type);
    }

    audio.onplay = () => {
      console.log('[AudioPlayback] Audio started playing');
      setIsPlaying(true);
      setCurrentAudio(audio);
    };

    audio.onended = () => {
      console.log('[AudioPlayback] Audio playback ended');
      setIsPlaying(false);
      setCurrentAudio(null);

      // Clean up blob URL
      if (source instanceof Blob) {
        URL.revokeObjectURL(audioUrl);
      }

      // Play next in queue
      setQueue((prevQueue) => {
        if (prevQueue.length > 0) {
          const [nextAudio, ...rest] = prevQueue;
          console.log('[AudioPlayback] Playing next in queue');
          play(nextAudio);
          return rest;
        }
        return prevQueue;
      });
    };

    audio.onerror = (error) => {
      console.error('[AudioPlayback] Audio playback error:', error);
      setIsPlaying(false);
      setCurrentAudio(null);

      // Clean up blob URL
      if (source instanceof Blob) {
        URL.revokeObjectURL(audioUrl);
      }
    };

    console.log('[AudioPlayback] Calling audio.play()');
    audio.play().then(() => {
      console.log('[AudioPlayback] audio.play() succeeded');
    }).catch((error) => {
      console.error('[AudioPlayback] Failed to play audio:', error);
      setIsPlaying(false);
    });
  }, []);

  /**
   * Add audio to queue
   * @param {Blob|string} source - Audio blob or URL
   */
  const enqueue = useCallback(
    (source) => {
      if (isPlaying) {
        setQueue((prevQueue) => [...prevQueue, source]);
      } else {
        play(source);
      }
    },
    [isPlaying, play]
  );

  /**
   * Stop current audio playback
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  }, []);

  /**
   * Clear audio queue
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  /**
   * Pause current audio
   */
  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  /**
   * Resume paused audio
   */
  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    isPlaying,
    currentAudio,
    queueLength: queue.length,
    play,
    enqueue,
    stop,
    pause,
    resume,
    clearQueue,
  };
}
