"use client";

import { Card } from "@/components/ui/card";
import {
  useShowTransliteration,
  useShowTranslation,
  useSettings,
} from "@/lib/store/settings-store";
import type { NameWithTranslations } from "@/lib/db/types";

interface NamePanelProps {
  name: NameWithTranslations;
  /**
   * Direction of the translation text (from `languages.direction`).
   * Used when the translation language is RTL (e.g., Urdu, Arabic).
   */
  translationDirection?: "ltr" | "rtl";
  /**
   * Direction of the transliteration text. Usually 'ltr' since most
   * transliterations are Latin-script, but included for flexibility.
   */
  transliterationDirection?: "ltr" | "rtl";
}

/**
 * A single card displaying one of the 99 names.
 *
 * Layout (top to bottom):
 *   - Sequence number in the corner
 *   - Arabic name (always shown, Uthmanic font)
 *   - Transliteration (if enabled)
 *   - Translation (if enabled)
 *
 * Reads visibility and font-size settings from the Zustand store.
 * Name data comes in as a prop — the parent is responsible for fetching.
 */
export function NamePanel({
  name,
  translationDirection = "ltr",
  transliterationDirection = "ltr",
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
      className="relative flex flex-col items-center justify-center gap-4 overflow-hidden p-6 text-center"
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Overlay for background-image legibility — only when image is set */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-background/75" aria-hidden="true" />
      )}

      {/* Content sits above the overlay */}
      <div className="relative flex w-full flex-col items-center gap-4">
        <span className="text-xs font-medium text-muted-foreground">
          {name.sequence}
        </span>

        <h2
          dir="rtl"
          lang="ar"
          className="font-uthmanic leading-tight font-bold"
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
