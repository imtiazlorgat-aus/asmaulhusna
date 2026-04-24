'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface FontSizeSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /**
   * Optional preview text displayed in the slider's own font size.
   * Helpful so users can see the effect without looking elsewhere.
   */
  previewText?: string;
  /** Font family to apply to the preview text. */
  previewFontFamily?: string;
  /** Direction for the preview text (e.g., 'rtl' for Arabic). */
  previewDirection?: 'ltr' | 'rtl';
}

/**
 * A labelled slider that controls a single font-size setting.
 *
 * Pure UI — doesn't know about the store. The parent reads the value
 * and passes in an onChange that writes to the store.
 */
export function FontSizeSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  previewText,
  previewFontFamily,
  previewDirection = 'ltr',
}: FontSizeSliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm text-muted-foreground tabular-nums">
          {value}px
        </span>
      </div>

      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
      />

      {previewText && (
        <div
          dir={previewDirection}
          className="rounded-md bg-muted/40 px-3 py-2 leading-tight"
          style={{
            fontSize: `${value}px`,
            fontFamily: previewFontFamily,
          }}
        >
          {previewText}
        </div>
      )}
    </div>
  );
}
