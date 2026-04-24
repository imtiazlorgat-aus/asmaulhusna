# Launch polish — integration steps

## 1. Drop files into place

```
app/layout.tsx                       ← replace existing (adds metadata + footer)
app/about/page.tsx                   ← new
app/not-found.tsx                    ← new
app/sitemap.ts                       ← new
app/robots.ts                        ← new
components/layout/Footer.tsx         ← new
```

No new packages needed — everything uses what you already have.

## 2. Generate favicon and icon files

Four image files are referenced by `app/layout.tsx` and need to exist
in `public/`:

| File | Size | Used for |
|------|------|----------|
| `public/favicon.ico` | 32×32 | Browser tab icon |
| `public/icon.png` | 32×32 | Modern PNG icon |
| `public/apple-icon.png` | 180×180 | iOS home screen icon |
| `public/og-image.png` | 1200×630 | Social share card |

For a quick start, [favicon.io](https://favicon.io/favicon-generator/)
lets you generate the first three from text in a minute. Try "99" or
"أ" (Arabic Alef) as the text, on a deep navy or black background
with white foreground, rounded corners for the PNG versions.

If you can't generate these immediately for launch, it won't crash
the site — the metadata will reference files that return 404, which
is harmless. But browsers show the default globe icon in their tab,
which looks unfinished. Worth doing before DNS cutover.

## 3. OG image brief (1200×630px)

For the social share card at `public/og-image.png`, a suggested design:

**Composition:**
- Centered Arabic text: the name "Ar-Rahman" (ٱلرَّحْمَٰنُ) in
  Uthmanic script, approximately 220px tall
- Below in sans-serif, smaller (~60px): "Asmaul Husna"
- Below that in muted grey (~32px): "asmaulhusna.co.za"
- Optional subtle arabesque pattern in one corner

**Colors matching your app:**
- Background: `#09090b` (dark mode background)
- Primary text: `#fafafa` (dark mode foreground)
- Muted text: `#a1a1aa`

If you don't want to create an OG image for v1, remove the
`openGraph.images` and `twitter.images` blocks from `layout.tsx` —
social shares will show just the title and description without a
card image. Clean and acceptable for a minimal launch.

## 4. Build and test locally

```powershell
pnpm build
```

Watch for:

- The route table at the end should list `[translitLang]/[transLang]`
  with **20 pages** (4 transliteration × 5 translation)
- No TypeScript or build errors

Then run the production build:

```powershell
pnpm start
```

Visit each page:

| URL | Expected |
|-----|----------|
| `/` | Redirects to `/asmaul-husna` → `/asmaul-husna/en/en` |
| `/asmaul-husna/en/en` | Viewer with footer showing About link |
| `/about` | Attribution and disclaimer page |
| `/asmaul-husna/settings` | Settings page |
| `/xyz` | Custom 404 page with Arabic "٤٠٤" |
| `/sitemap.xml` | XML listing 20 viewer URLs + `/about` |
| `/robots.txt` | Allows all, disallows `/asmaul-husna/settings` |

## 5. Commit

```powershell
git add .
git commit -m "Launch polish: about, 404, footer, sitemap, robots, metadata"
```

Once the build is clean and the pages all render, you're ready for
the deployment phase — Aiven database + Netlify site.
