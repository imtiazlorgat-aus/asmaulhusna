'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Curated backgrounds shipped in /public/backgrounds.
 *
 * To add more: drop a JPG/PNG into public/backgrounds/, add an entry
 * here with a short descriptive label, and rebuild. Consider file
 * size — under 150KB per image is a good target for fast panel loads.
 */
const PRESETS: Array<{ url: string; label: string }> = [
  { url: '/backgrounds/geometric-1.jpg', label: 'Geometric 1' },
  { url: '/backgrounds/geometric-2.jpg', label: 'Geometric 2' },
  { url: '/backgrounds/arabesque.jpg',   label: 'Arabesque' },
  { url: '/backgrounds/gradient-navy.jpg', label: 'Navy Gradient' },
];

interface BackgroundImagePickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function BackgroundImagePicker({
  value,
  onChange,
}: BackgroundImagePickerProps) {
  const [customUrl, setCustomUrl] = useState(
    value && !PRESETS.some((p) => p.url === value) ? value : '',
  );

  return (
    <div className="flex flex-col gap-3">
      <Label>Panel background</Label>

      {/* "None" option as first tile — clears the setting */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="No background"
          className={cn(
            'relative flex aspect-square items-center justify-center rounded-md border-2 bg-muted/30 text-xs text-muted-foreground transition-colors',
            value === null
              ? 'border-foreground'
              : 'border-transparent hover:border-muted-foreground/40',
          )}
        >
          <X className="h-4 w-4" />
        </button>

        {PRESETS.map((preset) => (
          <button
            key={preset.url}
            type="button"
            onClick={() => onChange(preset.url)}
            aria-label={preset.label}
            aria-pressed={value === preset.url}
            className={cn(
              'relative aspect-square overflow-hidden rounded-md border-2 transition-colors',
              value === preset.url
                ? 'border-foreground'
                : 'border-transparent hover:border-muted-foreground/40',
            )}
            style={{
              backgroundImage: `url(${preset.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </div>

      {/* Custom URL input */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="custom-bg-url" className="text-xs text-muted-foreground">
          Or paste an image URL
        </Label>
        <div className="flex gap-2">
          <input
            id="custom-bg-url"
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange(customUrl.trim() || null)}
            disabled={!customUrl.trim()}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
