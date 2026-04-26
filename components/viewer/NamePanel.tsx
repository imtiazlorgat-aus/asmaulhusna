'use client';

import { Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  useShowTransliteration,
  useShowTranslation,
  useSettings,
} from '@/lib/store/settings-store';
import { cn } from '@/lib/utils';
import type { NameWithTranslations } from '@/lib/db/types';

interface NamePanelProps {
  name: NameWithTranslations;
  /**
   * Direction of the translation text (from `languages.direction`).
   * Used when the translation language is RTL (e.g., Urdu, Arabic).
   */
  translationDirection?: 'ltr' | 'rtl';
  /**
   * Direction of the transliteration text. Usually 'ltr' since most
   * transliterations are Latin-script, but included for flexibility.
   */
  transliterationDirection?: 'ltr' | 'rtl';
  /**
   * When true, this panel is the currently-recited name. Adds a
   * highlighted ring. Coordinated by the parent via the audio playback
   * hook.
   */
  isActive?: boolean;
  /**
   * Optional handler for the per-panel speaker button. When omitted,
   * the speaker button is hidden (e.g., when no recitation is loaded).
   */
  onPlay?: (nameId: number) => void;
}

/**
 * A single card displaying one of the 99 names.
 *
 * Layout (top to bottom):
 *   - Top row: sequence number on the left, speaker icon on the right
 *   - Arabic name (always shown, Uthmanic font)
 *   - Transliteration (if enabled)
 *   - Translation (if enabled)
 *
 * Reads visibility and font-size settings from the Zustand store.
 * Name data comes in as a prop — the parent is responsible for fetching.
 */
export function NamePanel({
  name,
  translationDirection = 'ltr',
  transliterationDirection = 'ltr',
  isActive = false,
  onPlay,
}: NamePanelProps) {
  const showTransliteration = useShowTransliteration();
  const showTranslation = useShowTranslation();

  // Read font sizes directly rather than through selector hooks — we
  // need all three on every render, so there's nothing to optimize.
  const arabicFontSize = useSettings((s) => s.arabicFontSize);
  const transliterationFontSize = useSettings((s) => s.transliterationFontSize);
  const translationFontSize = useSettings((s) => s.translationFontSize);
  const backgroundImageUrl = useSettings((s) => s.backgroundImageUrl);

  return (
    <Card
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 overflow-hidden p-6 text-center shadow-lg transition-shadow duration-200',
        isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
      )}
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Overlay for background-image legibility — only when image is set */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-background/75" aria-hidden="true" />
      )}

      {/* Top row: sequence number left, speaker right (when audio available).
          Sits above the main content stack. */}
      <div className="relative flex w-full items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {name.sequence}
        </span>
        {onPlay && (
          <button
            type="button"
            onClick={(e) => {
              // Stop swipe handlers on the parent grid from interpreting
              // the tap as a swipe gesture.
              e.stopPropagation();
              onPlay(name.id);
            }}
            aria-label={`Play ${name.transliteration ?? `name ${name.sequence}`}`}
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive && 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary',
            )}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content sits above the overlay */}
      <div className="relative flex w-full flex-col items-center gap-4">
        <h2
          dir="rtl"
          lang="ar"
          className="font-uthmanic leading-tight"
          style={{ fontSize: `${arabicFontSize}px` }}
        >
          {name.arabic}
        </h2>

        {showTransliteration && name.transliteration && (
          <p
            dir={transliterationDirection}
            className="italic text-muted-foreground"
            style={{ fontSize: `${transliterationFontSize}px` }}
          >
            {name.transliteration}
          </p>
        )}

        {showTranslation && name.translation && (
          <p
            dir={translationDirection}
            className="text-foreground"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {name.translation}
          </p>
        )}
      </div>
    </Card>
  );
}
