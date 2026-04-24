# Database

Schema and seed data for the Asmaul Husna app.

## Layout

```
db/
  migrations/          # Schema DDL, applied in lexical order
    001_languages.sql
    002_names.sql
    003_translations.sql
  seeds/               # Data inserts, applied in lexical order
    001_languages.sql
    002_names.sql
    003_translations_en.sql
    004_translations_ur.sql   # awaiting scholarly contribution
    005_translations_id.sql   # awaiting scholarly contribution
    006_translations_ms.sql   # awaiting scholarly contribution
  apply.sh             # Helper to run everything via psql
```

No migration tracking table — this is a small schema and re-running the
files is safe (all DDL uses `IF NOT EXISTS`, seeds use `ON CONFLICT DO UPDATE`).

## Local development

Start a local Postgres instance (any version ≥ 14 is fine), then:

```bash
createdb --encoding=UTF8 --locale=en_US.UTF-8 --template=template0 asmaulhusna
export DATABASE_URL=postgres://localhost:5432/asmaulhusna
./db/apply.sh
```

Sanity check:

```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM names;"
# should return 99

psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM translations WHERE language_code='en';"
# should return 99
```

## Aiven (QA/prod)

1. Create a Postgres service in Aiven.
2. Copy the Service URI from the Aiven console — it will look like
   `postgres://avnadmin:...@pg-xxx.aivencloud.com:12345/defaultdb?sslmode=require`.
3. Apply migrations and seeds:

   ```bash
   export DATABASE_URL='<aiven service uri>'
   ./db/apply.sh
   ```

4. Set the same `DATABASE_URL` in Netlify's environment variables for
   the site deployment.

### Optional: CA verification

For stricter SSL verification (`sslmode=verify-full`), download the
CA certificate from Aiven and point `sslrootcert` at it in the
connection string. Not required for v1 but worth doing before public
launch.

## Scholarly review

Before public launch, the following files need review by a qualified
scholar:

- `seeds/002_names.sql` — Arabic text (Uthmanic script) for all 99 names
- `seeds/003_translations_en.sql` — English transliteration and meanings

Known areas of nuance flagged for attention:

- Names 48 (الْمَجِيدُ) and 65 (الْمَاجِدُ) — distinct in Arabic, often
  both rendered "Al-Majid" in English. Consider distinguishing meanings.
- Names 55 (الْوَلِيُّ) and 77 (الْوَالِي) — same transliteration, distinct
  meanings ("Protecting Friend" vs "Governor"). Slug for 77 is
  `al-wali-77` to avoid collision.
- Names 22/25/91 (Al-Khafid / Al-Mudhill / Ad-Darr) carry strong meanings
  that some translators pair or contextualize with their counterparts
  (Ar-Rafi / Al-Mu'izz / An-Nafi) — worth a note in the UI.

Urdu, Indonesian, and Malay translations (`004`, `005`, `006`) are stubs
and need to be sourced from qualified contributors before those languages
are activated in the UI.

## Re-running after changes

Both migrations and seeds are idempotent:

- Migrations use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
- Seeds use `INSERT ... ON CONFLICT ... DO UPDATE`, so editing a row
  and re-running updates the existing record.

Destructive changes (dropping columns, renaming tables) will require
new migration files — never edit an already-applied file in place once
it's been run against Aiven.
