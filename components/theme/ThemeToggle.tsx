'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Three-way theme toggle: Light → Dark → System.
 *
 * Renders a single icon button that cycles through the three modes
 * on each click. The icon reflects the current *choice* (not the
 * resolved theme) so users can tell at a glance whether they're on
 * "follow system" or have picked a specific mode.
 *
 * The `mounted` gate avoids hydration mismatch — on the server we
 * don't know the resolved theme, so we render a placeholder until
 * the client attaches.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // Before hydration, render a neutral placeholder with the same
  // dimensions so there's no layout shift when the real icon appears.
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const { icon, label } =
    theme === 'dark'
      ? { icon: <Moon className="h-4 w-4" />, label: 'Dark mode' }
      : theme === 'system'
        ? { icon: <Monitor className="h-4 w-4" />, label: 'System theme' }
        : { icon: <Sun className="h-4 w-4" />, label: 'Light mode' };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycle}
      aria-label={`${label} — click to change`}
      title={label}
    >
      {icon}
    </Button>
  );
}
