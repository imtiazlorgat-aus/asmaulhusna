import postgres from 'postgres';

/**
 * Singleton Postgres client.
 *
 * Uses porsager/postgres — lightweight, no ORM, parameterized by default
 * via tagged template literals.
 *
 * In dev we cache the client on globalThis so hot-reload doesn't exhaust
 * the connection pool; in prod each serverless function gets its own.
 */

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }

  // Derive SSL requirement from the URL itself so it works in `next dev`
  // (Next.js overrides NODE_ENV to "development" regardless of .env.local).
  const sslMode = new URL(url).searchParams.get('sslmode');
  const ssl = sslMode === 'require' || sslMode === 'verify-full' ? 'require' : false;

  return postgres(url, {
    ssl,
    // Keep the pool small: during Next.js prerendering each worker spawns its
    // own client (the globalThis singleton is skipped in production), so
    // max × worker-count must stay under Aiven's connection limit.
    max: 2,
    idle_timeout: 10,
    connect_timeout: 10,
    onnotice: () => {},
  });
}

export const sql = globalThis.__sql ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sql = sql;
}
