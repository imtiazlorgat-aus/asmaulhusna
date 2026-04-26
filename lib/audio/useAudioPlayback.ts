'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RecitationTiming } from '@/lib/db/types';

interface UseAudioPlaybackOptions {
  audioUrl: string;
  timings: RecitationTiming[];
  /**
   * Fires whenever the active name changes during playback. Pass the
   * name's id (1..99), or null when audio stops or no name matches the
   * current timestamp.
   */
  onActiveNameChange?: (nameId: number | null) => void;
}

interface UseAudioPlaybackReturn {
  /** Currently playing or not. */
  isPlaying: boolean;
  /** The active name id (1..99), or null when not playing. */
  activeNameId: number | null;
  /** Start playing from name #1, continue through to the end. */
  playAll: () => void;
  /**
   * Play a single name by id, then stop automatically when its end_ms
   * is reached. If audio is already playing (in any mode), it switches
   * to play just this name.
   */
  playOne: (nameId: number) => void;
  /** Stop playback. */
  stop: () => void;
}

/**
 * Manages audio playback for a single recitation.
 *
 * Supports two playback modes:
 *   - "all": plays from name #1 through to the audio's natural end
 *   - "one": plays a single name, stopping at its end_ms boundary
 *
 * Mode is tracked internally so the timeupdate listener knows whether
 * to stop at a boundary or let playback continue.
 */
export function useAudioPlayback({
  audioUrl,
  timings,
  onActiveNameChange,
}: UseAudioPlaybackOptions): UseAudioPlaybackReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNameId, setActiveNameId] = useState<number | null>(null);

  // When set, playback stops as soon as currentTime crosses this mark.
  // Used by playOne to stop at the name's end_ms. Null in playAll mode.
  const stopAtMsRef = useRef<number | null>(null);

  // Keep callback in a ref so the audio-setup effect doesn't re-run.
  const onActiveNameChangeRef = useRef(onActiveNameChange);
  useEffect(() => {
    onActiveNameChangeRef.current = onActiveNameChange;
  }, [onActiveNameChange]);

  // Sort timings by start_ms; we rely on this for the active-name lookup.
  const sortedTimings = useRef(
    [...timings].sort((a, b) => a.start_ms - b.start_ms),
  );
  useEffect(() => {
    sortedTimings.current = [...timings].sort((a, b) => a.start_ms - b.start_ms);
  }, [timings]);

  // Lazy-create the audio element on first use.
  const ensureAudio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio();
    audio.src = audioUrl;
    audio.preload = 'metadata';
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      const currentMs = audio.currentTime * 1000;

      // playOne mode: stop when we cross the end-of-name boundary.
      if (stopAtMsRef.current !== null && currentMs >= stopAtMsRef.current) {
        audio.pause();
        audio.currentTime = 0;
        stopAtMsRef.current = null;
        setIsPlaying(false);
        setActiveNameId(null);
        onActiveNameChangeRef.current?.(null);
        return;
      }

      // Track active name for highlighting + page auto-flip.
      const nameId = findActiveName(sortedTimings.current, currentMs);
      setActiveNameId((prev) => {
        if (prev === nameId) return prev;
        onActiveNameChangeRef.current?.(nameId);
        return nameId;
      });
    });

    audio.addEventListener('ended', () => {
      stopAtMsRef.current = null;
      setIsPlaying(false);
      setActiveNameId(null);
      onActiveNameChangeRef.current?.(null);
    });

    audio.addEventListener('pause', () => {
      // Distinguish "ended" pause from explicit pause.
      if (audio.currentTime < audio.duration) {
        setIsPlaying(false);
      }
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error', e);
      stopAtMsRef.current = null;
      setIsPlaying(false);
      setActiveNameId(null);
      onActiveNameChangeRef.current?.(null);
    });

    return audio;
  }, [audioUrl]);

  const playAll = useCallback(() => {
    const audio = ensureAudio();
    stopAtMsRef.current = null;
    const firstStart = sortedTimings.current[0]?.start_ms ?? 0;
    audio.currentTime = firstStart / 1000;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error('Audio play failed', err);
        setIsPlaying(false);
      });
  }, [ensureAudio]);

  const playOne = useCallback(
    (nameId: number) => {
      const timing = sortedTimings.current.find((t) => t.name_id === nameId);
      if (!timing) {
        console.warn(`No timing found for name id ${nameId}`);
        return;
      }
      const audio = ensureAudio();
      stopAtMsRef.current = timing.end_ms;
      audio.currentTime = timing.start_ms / 1000;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setActiveNameId(nameId);
          onActiveNameChangeRef.current?.(nameId);
        })
        .catch((err) => {
          console.error('Audio play failed', err);
          setIsPlaying(false);
        });
    },
    [ensureAudio],
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    stopAtMsRef.current = null;
    setIsPlaying(false);
    setActiveNameId(null);
    onActiveNameChangeRef.current?.(null);
  }, []);

  // Clean up audio element on unmount.
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  return { isPlaying, activeNameId, playAll, playOne, stop };
}

function findActiveName(
  timings: RecitationTiming[],
  currentMs: number,
): number | null {
  for (const t of timings) {
    if (currentMs >= t.start_ms && currentMs < t.end_ms) {
      return t.name_id;
    }
  }
  return null;
}
