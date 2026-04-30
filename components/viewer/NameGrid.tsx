"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NamePanel } from "./NamePanel";
import { PaginationControls } from "./PaginationControls";
import { VisibilityToggles } from "./VisibilityToggles";
import { useSettings } from "@/lib/store/settings-store";
import { useAudioPlayback } from "@/lib/audio/useAudioPlayback";
import { WelcomeToast } from "./WelcomeToast";
import type { DefaultRecitation, NameWithTranslations } from "@/lib/db/types";

interface NameGridProps {
  /** All 99 names with translations for the chosen language pair. */
  names: NameWithTranslations[];
  /** Direction of the translation language (from `languages.direction`). */
  translationDirection?: "ltr" | "rtl";
  /** Direction of the transliteration language (usually 'ltr'). */
  transliterationDirection?: "ltr" | "rtl";
  /**
   * Default recitation data. When null/undefined, the Listen button is
   * hidden — viewer still works as a read-only experience.
   */
  recitation?: DefaultRecitation | null;
}

/**
 * The main viewer orchestrator.
 *
 * Responsibilities:
 *   - Holds `currentPage` (local state — no need for a URL param in v1)
 *   - Reads `namesPerPage` from the settings store
 *   - Slices `names` by the current page window
 *   - Renders toggles, the grid, and pagination controls
 *   - Drives audio playback when a recitation is provided
 *
 * If `namesPerPage` changes (e.g., the user bumps it up in settings),
 * we reset to page 1 rather than trying to keep the user on a page
 * that may no longer exist.
 *
 * Audio coordination: when audio plays, the active name advances
 * through 1..99 and we auto-flip pages to keep the active panel
 * visible. User-driven page changes (pagination buttons or swipe)
 * stop audio; audio-driven page changes don't.
 */
export function NameGrid({
  names,
  translationDirection = "ltr",
  transliterationDirection = "ltr",
  recitation,
}: NameGridProps) {
  const namesPerPage = useSettings((s) => s.namesPerPage);
  const swipeUpDown = useSettings((s) => s.swipeUpDown);
  const swipeLeftRight = useSettings((s) => s.swipeLeftRight);

  const [{ currentPage, perPage }, setPagination] = useState({
    currentPage: 1,
    perPage: namesPerPage,
  });
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const effectivePage = perPage === namesPerPage ? currentPage : 1;

  // Auto-flip the page to wherever the audio's current name lives.
  // Bypasses the user-driven setCurrentPage path so there's no risk
  // of stopping the audio that's driving the change.
  const handleActiveNameChange = (nameId: number | null) => {
    if (nameId === null) return;
    const index = names.findIndex((n) => n.id === nameId);
    if (index === -1) return;
    const requiredPage = Math.floor(index / namesPerPage) + 1;
    setPagination((prev) => {
      if (prev.currentPage === requiredPage && prev.perPage === namesPerPage) {
        return prev;
      }
      return { currentPage: requiredPage, perPage: namesPerPage };
    });
  };

  const audio = useAudioPlayback({
    audioUrl: recitation?.recitation.audio_url ?? "",
    timings: recitation?.timings ?? [],
    onActiveNameChange: handleActiveNameChange,
  });

  // Keep a live ref to the audio controls so handlers below always
  // see the current state without needing audio in their dep arrays.
  const audioRef = useRef(audio);
  useEffect(() => {
    audioRef.current = audio;
  });

  // User-driven page change. Stops audio if it's playing.
  const setCurrentPage = (page: number | ((p: number) => number)) => {
    if (audioRef.current.isPlaying) {
      audioRef.current.stop();
    }
    setPagination((prev) => ({
      currentPage: typeof page === "function" ? page(prev.currentPage) : page,
      perPage: namesPerPage,
    }));
  };

  const handleListenClick = () => {
    if (audioRef.current.isPlaying) {
      audioRef.current.stop();
    } else {
      // Jump to page 1 so the user sees name #1 highlighted, then play.
      setPagination({ currentPage: 1, perPage: namesPerPage });
      audioRef.current.playAll();
    }
  };

  // Per-panel speaker button — play just this one name.
  // If audio is already playing (any mode) and the user taps the
  // speaker on the currently-active name, stop. Otherwise, switch
  // to single-name playback for the tapped name.
  const handlePlayOne = (nameId: number) => {
    if (
      audioRef.current.isPlaying &&
      audioRef.current.activeNameId === nameId
    ) {
      audioRef.current.stop();
    } else {
      audioRef.current.playOne(nameId);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (swipeLeftRight && absDx >= 50 && absDx >= absDy) {
      if (dx < 0) setCurrentPage((p) => Math.min(totalPages, p + 1));
      else setCurrentPage((p) => Math.max(1, p - 1));
    } else if (swipeUpDown && absDy >= 50 && absDy > absDx) {
      if (dy < 0) setCurrentPage((p) => Math.min(totalPages, p + 1));
      else setCurrentPage((p) => Math.max(1, p - 1));
    }
  };

  // Derive totals from the current slice size.
  const totalPages = Math.max(1, Math.ceil(names.length / namesPerPage));

  const visibleNames = useMemo(() => {
    const start = (effectivePage - 1) * namesPerPage;
    return names.slice(start, start + namesPerPage);
  }, [names, effectivePage, namesPerPage]);

  // Only pass onPlay to panels when a recitation exists. NamePanel
  // hides the speaker button when onPlay is undefined.
  const onPanelPlay = recitation ? handlePlayOne : undefined;

  return (
    <div className="flex flex-col gap-6">
      <WelcomeToast />
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {visibleNames.map((name) => (
          <NamePanel
            key={name.id}
            name={name}
            translationDirection={translationDirection}
            transliterationDirection={transliterationDirection}
            isActive={audio.activeNameId === name.id}
            onPlay={onPanelPlay}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={effectivePage}
        totalPages={totalPages}
        onFirst={() => setCurrentPage(1)}
        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        onLast={() => setCurrentPage(totalPages)}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        {recitation && (
          <Button
            variant="outline"
            title="Arabic Audio"
            size="sm"
            onClick={handleListenClick}
            aria-label={audio.isPlaying ? "Stop" : "Listen"}
            aria-pressed={audio.isPlaying}
            className={
              audio.isPlaying
                ? "bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-800"
                : " hover:bg-gray-300 hover:dark:bg-gray-800"
            }
          >
            {audio.isPlaying ? (
              <>
                <Square className="h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Headphones className="h-4 w-4" />
                Listen
              </>
            )}
          </Button>
        )}
        <VisibilityToggles />
      </div>
    </div>
  );
}
