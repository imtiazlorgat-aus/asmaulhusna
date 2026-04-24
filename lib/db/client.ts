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

  // Aiven requires SSL in production. For local dev against a plain
  // Postgres instance, ssl:false avoids a needless handshake.
  const isProd = process.env.NODE_ENV === 'production';

  return postgres(url, {
    ssl: isProd ? 'require' : false,
    max: 10,            // connection pool cap
    idle_timeout: 20,   // close idle connections after 20s
    connect_timeout: 10,
    // Serialize Postgres errors so they show up usefully in Netlify logs.
    onnotice: () => {}, // silence NOTICE output
  });
}

export const sql = globalThis.__sql ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sql = sql;
}
