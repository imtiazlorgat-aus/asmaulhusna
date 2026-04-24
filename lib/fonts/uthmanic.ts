import localFont from "next/font/local";

/**
 * KFGQPC Uthmanic Hafs — the standard Uthmanic script typeface
 * published by the King Fahd Glorious Quran Printing Complex.
 *
 * Download the font file from a reputable source (e.g., the KFGQPC
 * official site or the Tanzil project mirror) and place it at
 * public/fonts/UthmanicHafs_v22.ttf. The file name below must match
 * the one on disk.
 *
 * We expose this as a CSS variable so Tailwind and inline styles can
 * both reference it via `var(--font-uthmanic)`.
 */
export const uthmanic = localFont({
  src: "../../public/fonts/UthmanicHafs18.ttf",
  variable: "--font-uthmanic",
  display: "swap",
});
