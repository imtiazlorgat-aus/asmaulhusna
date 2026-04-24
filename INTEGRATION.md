# Integration steps

After dropping in the four new files, you need to wire up the Uthmanic
font and verify everything renders. This is a one-time setup.

## 1. Download the Uthmanic font

The KFGQPC Uthmanic Hafs font is freely available from several sources.
A reliable mirror is the Tanzil project:

  https://tanzil.net/res/font/

Download `UthmanicHafs_v22.ttf` (or whatever the latest version is named)
and save it to:

  public/fonts/UthmanicHafs_v22.ttf

If the filename on disk differs from `UthmanicHafs_v22.ttf`, update the
`src` path in `lib/fonts/uthmanic.ts` to match.

## 2. Register the font in the root layout

Open `app/layout.tsx`. Import the font loader and apply its CSS variable
to the `<html>` element:

```tsx
import { uthmanic } from '@/lib/fonts/uthmanic';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={uthmanic.variable}>
      <body>{children}</body>
    </html>
  );
}
```

The `uthmanic.variable` adds a class that defines `--font-uthmanic` as
a CSS custom property on the root element. Children can then reference
it via `var(--font-uthmanic)`.

## 3. Register the font family in Tailwind

Open `tailwind.config.ts` (or `tailwind.config.js` if yours is JS). In
Tailwind v4 there is no config file at all — the config lives in
`app/globals.css` via the `@theme` directive. Adjust based on what
your scaffold produced.

### Tailwind v4 (config-less — the likely case with Next 15)

Open `app/globals.css`. Below the existing `@import "tailwindcss";` line,
add a `@theme` block (or extend the existing one):

```css
@theme {
  --font-uthmanic: var(--font-uthmanic), 'Traditional Arabic', serif;
}
```

This makes `font-uthmanic` available as a Tailwind utility class.

### Tailwind v3 (older scaffold)

If you have a `tailwind.config.ts`, extend the theme:

```ts
export default {
  theme: {
    extend: {
      fontFamily: {
        uthmanic: ['var(--font-uthmanic)', 'Traditional Arabic', 'serif'],
      },
    },
  },
};
```

## 4. Visit the demo page

Start the dev server if it's not already running:

```
pnpm dev
```

Navigate to http://localhost:3000/demo

You should see six cards rendered in a responsive grid, each showing
one of the first six names in Arabic (Uthmanic font), with transliteration
and English translation below.

## 5. Verify the store is working

Open browser DevTools → Application → Local Storage → http://localhost:3000.
You should see a key `asmaulhusna-settings` holding the current settings
object. Edit a value directly in DevTools, refresh, and the panel should
update to reflect it.

Once confirmed, delete `app/demo/page.tsx` — it was just for verification.
The real viewer will live at `/asmaul-husna/[translitLang]/[transLang]`
and we'll build that next.
