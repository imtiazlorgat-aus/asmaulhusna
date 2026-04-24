# asmaulhusna.co.za

A responsive website for Muslims to read and reflect on the 99 Names of
Allah (Asmaul Husna), with configurable Arabic, transliteration, and
translation display.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + Lucide icons
- PostgreSQL via [`postgres`](https://github.com/porsager/postgres) (no ORM)
- Zustand with localStorage persistence for user settings
- Self-hosted KFGQPC Uthmanic Hafs font via `next/font/local`
- Local Postgres for dev, Aiven for QA/prod
- Deployed to Netlify

## Structure

```
app/
  page.tsx                          # redirect to /asmaul-husna
  about/page.tsx
  asmaul-husna/
    page.tsx                        # redirect to default language pair
    [translitLang]/[transLang]/page.tsx   # main viewer (SSG + ISR)
    settings/page.tsx

components/
  viewer/      # NamePanel, NameGrid, PaginationControls, VisibilityToggles
  settings/    # FontSizeSlider, LanguageSelect, BackgroundImagePicker
  layout/      # Header, Footer

lib/
  db/          # client, queries, types
  store/       # Zustand settings store
  fonts/       # Uthmanic font loader

db/
  migrations/  # schema DDL
  seeds/       # starter data
  apply.sh     # helper to run against a DATABASE_URL

public/
  fonts/       # KFGQPC Uthmanic Hafs
  backgrounds/ # curated panel backgrounds
```

## Getting started

```bash
# 1. Install deps
npm install

# 2. Start a local Postgres and apply schema + seeds
createdb --encoding=UTF8 --locale=en_US.UTF-8 --template=template0 asmaulhusna
export DATABASE_URL=postgres://localhost:5432/asmaulhusna
./db/apply.sh

# 3. Configure env
cp .env.example .env.local
# edit .env.local to set DATABASE_URL

# 4. Run dev server
npm run dev
```

## Deployment

- **Database** → Aiven Postgres. See `db/README.md` for details.
- **Site** → Netlify. Set `DATABASE_URL` in Netlify env vars.

## Content

The 99 names seed (`db/seeds/002_names.sql`) and English translations
(`db/seeds/003_translations_en.sql`) are **drafts pending scholarly review**.
See `db/README.md` for details on the review process and known areas of
nuance.

Urdu, Indonesian, and Malay translation files are stubs awaiting
scholarly contribution.
