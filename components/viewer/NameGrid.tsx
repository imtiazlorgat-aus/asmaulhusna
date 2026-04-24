'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { NamePanel } from './NamePanel';
import { PaginationControls } from './PaginationControls';
import { VisibilityToggles } from './VisibilityToggles';
import { useSettings } from '@/lib/store/settings-store';
import type { NameWithTranslations } from '@/lib/db/types';

interface NameGridProps {
  /** All 99 names with translations for the chosen language pair. */
  names: NameWithTranslations[];
  /** Direction of the translation language (from `languages.direction`). */
  translationDirection?: 'ltr' | 'rtl';
  /** Direction of the transliteration language (usually 'ltr'). */
  transliterationDirection?: 'ltr' | 'rtl';
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
  translationDirection = 'ltr',
  transliterationDirection = 'ltr',
}: NameGridProps) {
  const namesPerPage = useSettings((s) => s.namesPerPage);
  const hasHydrated = useSettings((s) => s.hasHydrated);

  const [currentPage, setCurrentPage] = useState(1);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) setCurrentPage((p) => Math.min(totalPages, p + 1));
    else setCurrentPage((p) => Math.max(1, p - 1));
  };

  // Derive totals from the current slice size.
  const totalPages = Math.max(1, Math.ceil(names.length / namesPerPage));

  // Reset to page 1 whenever the slice size changes. Also guards
  // against currentPage exceeding totalPages after a hydration swap
  // from default namesPerPage to a smaller persisted value.
  useEffect(() => {
    setCurrentPage(1);
  }, [namesPerPage]);

  const visibleNames = useMemo(() => {
    const start = (currentPage - 1) * namesPerPage;
    return names.slice(start, start + namesPerPage);
  }, [names, currentPage, namesPerPage]);

  // Before hydration, we render with default settings. That's fine for
  // the panels themselves (they just show defaults briefly), but the
  // page indicator could flash "Page 1 of 17" then "Page 1 of 9" if
  // the persisted namesPerPage differs. Suppress the indicator's
  // transition by keying on hydration state.
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <VisibilityToggles />
      </div>

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
        currentPage={currentPage}
        totalPages={totalPages}
        onFirst={() => setCurrentPage(1)}
        onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        onLast={() => setCurrentPage(totalPages)}
      />
    </div>
  );
}
