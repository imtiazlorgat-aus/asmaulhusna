'use client';

import { useEffect, useRef } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type { ComponentProps } from 'react';
import { useSettings } from '@/lib/store/settings-store';

function invertHex(hex: string): string {
  if (hex.length !== 7) return hex;
  const r = 255 - parseInt(hex.slice(1, 3), 16);
  const g = 255 - parseInt(hex.slice(3, 5), 16);
  const b = 255 - parseInt(hex.slice(5, 7), 16);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Rendered inside NextThemesProvider so useTheme() resolves correctly.
// Watches for theme changes and inverts any custom text colors so they
// remain legible on the new background.
function ColorInverter() {
  const { resolvedTheme } = useTheme();
  const transliterationColor = useSettings((s) => s.transliterationColor);
  const translationColor = useSettings((s) => s.translationColor);
  const update = useSettings((s) => s.update);

  // Keep a stable ref to the current colors so the effect always reads
  // the latest values without needing them as dependencies.
  const colorsRef = useRef({ transliterationColor, translationColor });
  colorsRef.current = { transliterationColor, translationColor };

  const prevThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevThemeRef.current === undefined) {
      prevThemeRef.current = resolvedTheme;
      return;
    }
    if (prevThemeRef.current === resolvedTheme) return;
    prevThemeRef.current = resolvedTheme;

    const { transliterationColor, translationColor } = colorsRef.current;
    const patch: Record<string, string> = {};
    if (transliterationColor) patch.transliterationColor = invertHex(transliterationColor);
    if (translationColor) patch.translationColor = invertHex(translationColor);
    if (Object.keys(patch).length > 0) update(patch);
  }, [resolvedTheme, update]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ColorInverter />
      {children}
    </NextThemesProvider>
  );
}
