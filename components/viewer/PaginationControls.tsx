'use client';

import { Button } from '@/components/ui/button';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
}

/**
 * Presentational pagination control row.
 *
 * Pure UI — knows nothing about the data being paginated. Buttons are
 * disabled at the boundaries so the parent doesn't have to guard the
 * callbacks; keyboard nav (Enter/Space on focused button) works via
 * the underlying shadcn Button.
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onFirst,
  onPrevious,
  onNext,
  onLast,
}: PaginationControlsProps) {
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onFirst}
        disabled={atStart}
        aria-label="First page"
      >
        <ChevronFirst className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={atStart}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span
        className="min-w-[5rem] text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={atEnd}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onLast}
        disabled={atEnd}
        aria-label="Last page"
      >
        <ChevronLast className="h-4 w-4" />
      </Button>
    </nav>
  );
}
