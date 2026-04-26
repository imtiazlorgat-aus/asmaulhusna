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
  /** Start playing from name #1. */
  playAll: () => void;
  /** Stop playback. */
  stop: () => void;
}

/**
 * Manages audio playback for a single recitation, coordinating with
 * the visual UI via the `onActiveNameChange` callback.
 *
 * Why a hook rather than putting the audio element in JSX directly:
 *   - The audio element lives across re-renders and page changes
 *     within a session. A hook keeps it tied to component lifetime
 *     without the complications of refs in JSX.
 *   - We want a single shared element, not per-panel elements.
 *   - The state (isPlaying, activeNameId) is what components render.
 */
export function useAudioPlayback({
  audioUrl,
  timings,
  onActiveNameChange,
}: UseAudioPlaybackOptions): UseAudioPlaybackReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNameId, setActiveNameId] = useState<number | null>(null);

  // Keep callbacks in a ref so the effect below doesn't re-run when
  // they change. The effect should only set up the audio element once.
  const onActiveNameChangeRef = useRef(onActiveNameChange);
  useEffect(() => {
    onActiveNameChangeRef.current = onActiveNameChange;
  }, [onActiveNameChange]);

  // Sort timings by start_ms once; we rely on this order for lookups.
  const sortedTimings = useRef(
    [...timings].sort((a, b) => a.start_ms - b.start_ms),
  );
  useEffect(() => {
    sortedTimings.current = [...timings].sort((a, b) => a.start_ms - b.start_ms);
  }, [timings]);

  // Lazy-create the audio element on first use rather than on mount.
  // Avoids the browser starting to download the audio file before the
  // user has shown intent to play.
  const ensureAudio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio();
    audio.src = audioUrl;
    audio.preload = 'metadata';
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      const currentMs = audio.currentTime * 1000;
      const nameId = findActiveName(sortedTimings.current, currentMs);
      setActiveNameId((prev) => {
        if (prev === nameId) return prev;
        onActiveNameChangeRef.current?.(nameId);
        return nameId;
      });
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setActiveNameId(null);
      onActiveNameChangeRef.current?.(null);
    });

    audio.addEventListener('pause', () => {
      // Distinguish between "ended" pause (handled above) and explicit
      // user/programmatic pause. If currentTime is at the end, ended
      // already fired; otherwise it's a real pause.
      if (audio.currentTime < audio.duration) {
        setIsPlaying(false);
      }
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error', e);
      setIsPlaying(false);
      setActiveNameId(null);
      onActiveNameChangeRef.current?.(null);
    });

    return audio;
  }, [audioUrl]);

  const playAll = useCallback(() => {
    const audio = ensureAudio();
    // Always start from the first timing's start_ms (typically name #1).
    const firstStart = sortedTimings.current[0]?.start_ms ?? 0;
    audio.currentTime = firstStart / 1000;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error('Audio play failed', err);
        setIsPlaying(false);
      });
  }, [ensureAudio]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setActiveNameId(null);
    onActiveNameChangeRef.current?.(null);
  }, []);

  // Clean up audio element when the component unmounts.
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  return { isPlaying, activeNameId, playAll, stop };
}

/**
 * Find which name corresponds to the given playback position.
 * Returns the name_id, or null if currentMs falls outside any timing.
 *
 * Linear scan is fine for 99 entries — far simpler than binary search
 * and doesn't appear in any hot path that would justify the complexity.
 */
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
