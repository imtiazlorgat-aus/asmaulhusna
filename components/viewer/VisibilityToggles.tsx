"use client";

import { CaseSensitive, Eye, EyeOff, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/store/settings-store";

export function VisibilityToggles() {
  const showTransliteration = useSettings((s) => s.showTransliteration);
  const showTranslation = useSettings((s) => s.showTranslation);
  const update = useSettings((s) => s.update);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="outline"
        title="Show/Hide Transliteration"
        size="sm"
        className={
          showTransliteration
            ? "bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-800"
            : ""
        }
        onClick={() => update({ showTransliteration: !showTransliteration })}
        aria-pressed={showTransliteration}
      >
        <CaseSensitive className="h-4 w-4" />
        Transliteration
        {showTransliteration ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="outline"
        title="Show/Hide Translation"
        size="sm"
        className={
          showTranslation
            ? "bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-800"
            : ""
        }
        onClick={() => update({ showTranslation: !showTranslation })}
        aria-pressed={showTranslation}
      >
        <Globe className="h-4 w-4" />
        Translation
        {showTranslation ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
