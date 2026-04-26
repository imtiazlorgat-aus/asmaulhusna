"use client";

import { useMemo, useRef, useState } from "react";
import { NamePanel } from "./NamePanel";
import { PaginationControls } from "./PaginationControls";
import { VisibilityToggles } from "./VisibilityToggles";
import { useSettings } from "@/lib/store/settings-store";
import { WelcomeToast } from "./WelcomeToast";
import type { NameWithTranslations } from "@/lib/db/types";

interface NameGridProps {
  /** All 99 names with translations for the chosen language pair. */
  names: NameWithTranslations[];
  /** Direction of the translation language (from `languages.direction`). */
  translationDirection?: "ltr" | "rtl";
  /** Direction of the transliteration language (usually 'ltr'). */
  transliterationDirection?: "ltr" | "rtl";
}

/**
 * The main viewer orchestrator.
 *
 * Responsibilities:
 *   - Holds `currentPage` (local state — no need for a URL param in v1)
 *   - Reads `namesPerPage` from the settings store
 *   - Slices `names` by the current page window
 *   - Renders toggles, the grid, and pagination controls
 *
 * If `namesPerPage` changes (e.g., the user bumps it up in settings),
 * we reset to page 1 rather than trying to keep the user on a page
 * that may no longer exist.
 */
export function NameGrid({
  names,
  translationDirection = "ltr",
  transliterationDirection = "ltr",
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
  const setCurrentPage = (page: number | ((p: number) => number)) =>
    setPagination((prev) => ({
      currentPage: typeof page === "function" ? page(prev.currentPage) : page,
      perPage: namesPerPage,
    }));

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

  // Before hydration, we render with default settings. That's fine for
  // the panels themselves (they just show defaults briefly), but the
  // page indicator could flash "Page 1 of 17" then "Page 1 of 9" if
  // the persisted namesPerPage differs. Suppress the indicator's
  // transition by keying on hydration state.
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

      <div className="flex justify-center">
        <VisibilityToggles />
      </div>
    </div>
  );
}
