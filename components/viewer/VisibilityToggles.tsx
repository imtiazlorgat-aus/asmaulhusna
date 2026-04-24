'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/lib/store/settings-store';

/**
 * Two switches for toggling transliteration and translation visibility.
 *
 * Reads from and writes to the Zustand store directly. No props — this
 * is a self-contained control that can be dropped anywhere in the UI.
 */
export function VisibilityToggles() {
  const showTransliteration = useSettings((s) => s.showTransliteration);
  const showTranslation = useSettings((s) => s.showTranslation);
  const update = useSettings((s) => s.update);

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch
          id="toggle-transliteration"
          checked={showTransliteration}
          onCheckedChange={(checked) =>
            update({ showTransliteration: checked })
          }
        />
        <Label htmlFor="toggle-transliteration" className="cursor-pointer">
          Transliteration
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="toggle-translation"
          checked={showTranslation}
          onCheckedChange={(checked) =>
            update({ showTranslation: checked })
          }
        />
        <Label htmlFor="toggle-translation" className="cursor-pointer">
          Translation
        </Label>
      </div>
    </div>
  );
}
