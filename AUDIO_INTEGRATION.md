# Audio playback feature — integration steps

This adds a "Listen" button (left of the visibility toggles) that
plays the default recitation through all 99 names, auto-paginating
and highlighting the currently-recited panel.

Built specifically against your current code: swipe gestures preserved,
WelcomeToast preserved, ShareButton untouched, VisibilityToggles
position at the bottom preserved.

## 1. Drop in the new and updated files

```
db/migrations/004_recitations.sql                      ← NEW
db/convert-labels.ps1                                  ← NEW
lib/db/types.ts                                        ← REPLACE
lib/db/queries.ts                                      ← REPLACE
lib/audio/useAudioPlayback.ts                          ← NEW
components/viewer/NamePanel.tsx                        ← REPLACE
components/viewer/NameGrid.tsx                         ← REPLACE
```

No new packages required.

## 2. Update the viewer page (one small edit)

This file isn't in the zip you sent, so I haven't reproduced it here.
Open:

```
app/asmaul-husna/[translitLang]/[transLang]/page.tsx
```

Two small changes:

**Add the import:**

```typescript
import { getDefaultRecitation } from '@/lib/db/queries';
```

**Replace the `getNamesWithTranslations` call** with a parallel fetch:

```typescript
// Before:
const names = await getNamesWithTranslations(translitLang, transLang);

// After:
const [names, recitation] = await Promise.all([
  getNamesWithTranslations(translitLang, transLang),
  getDefaultRecitation(),
]);
```

**Pass `recitation` to NameGrid:**

```tsx
<NameGrid
  names={names}
  recitation={recitation}
  transliterationDirection={translit.direction}
  translationDirection={trans.direction}
/>
```

## 3. Place the audio file

```
public/audio/asmaulhusna.mp3
```

Choose any filename; just match it in step 5's `-AudioUrl`.

## 4. Apply the migration

Local first:

```powershell
$env:DATABASE_URL = "postgres://localhost:5432/asmaulhusna"
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f db\migrations\004_recitations.sql
```

## 5. Convert your Audacity labels and seed

You need the audio's exact duration in milliseconds. Right-click the
MP3 → Properties → Details → Length, multiply by 1000.

```powershell
.\db\convert-labels.ps1 `
  -LabelsFile "C:\path\to\Labels.txt" `
  -AudioUrl "/audio/asmaulhusna.mp3" `
  -Title "99 Names of Allah" `
  -Reciter "Reciter Name" `
  -LicenseNote "Permitted for free distribution by reciter, 2026" `
  -DurationMs 200000
```

The script writes `db/seeds/004_recitation_default.sql`. Apply it:

```powershell
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f db\seeds\004_recitation_default.sql
```

Verify:

```powershell
psql $env:DATABASE_URL -c "SELECT id, title, audio_url, is_default FROM recitations;"
psql $env:DATABASE_URL -c "SELECT COUNT(*) FROM recitation_timings;"
```

## 6. Test locally

```powershell
pnpm dev
```

Visit `localhost:3000/asmaul-husna/en/en`:

- A "Listen" button appears in the bottom row, left of the
  Transliteration and Translation toggle buttons
- Click it → audio starts from name #1 on page 1, panel highlights
  with a primary-coloured ring
- Page auto-flips when the active name moves off screen
- Button shows "Stop" while playing
- Click any pagination button → audio stops
- Swipe up/down/left-right → audio stops
- Audio reaches the end → returns to idle (Listen) state

## 7. Production deployment

```powershell
$env:DATABASE_URL = "postgres://avnadmin:...@pg-xxxx.aivencloud.com:PORT/defaultdb?sslmode=require"
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f db\migrations\004_recitations.sql
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f db\seeds\004_recitation_default.sql

git add .
git commit -m "Audio playback: Listen button with auto-pagination and active highlight"
git push
```

Netlify rebuilds. The MP3 in `public/audio/` ships as a static asset.

## Notes on what I preserved from your code

- **Swipe gestures**: your touch handlers are intact. Both swipe and
  pagination button clicks now stop audio when the user triggers them.
- **State pattern**: kept `{currentPage, perPage}` and `effectivePage`
  for the namesPerPage hydration trick.
- **WelcomeToast**: still rendered at the top of the grid.
- **VisibilityToggles**: still in the bottom row. Listen sits to its
  left in the same flex container.
- **NamePanel shadow-lg**: preserved.
- **PaginationControls hover styling**: untouched (your file isn't
  modified).
- **ShareButton**: untouched (your file isn't modified).

## What's new mechanically

- **`audioRef`** in NameGrid: avoids stale-closure bugs in the
  pagination handlers, since the audio control object is fresh on
  every render but handlers want the live state.
- **Audio-driven page changes** bypass `setCurrentPage` entirely —
  they go directly through `setPagination`, so they don't trigger
  the user-action stop logic.
- **User-driven page changes** go through `setCurrentPage` which
  stops audio if it's playing.
