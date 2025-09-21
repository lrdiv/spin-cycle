/*
  Robust migration runner for Fly release_command.
  - Waits for Postgres to be reachable (with retries)
  - Runs TypeORM migrations from compiled JS in dist
  - Exits cleanly so Fly can proceed with deploy
*/

/* eslint-disable no-console */
const { Client } = require('pg');
const { DataSource } = require('typeorm');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Aborting migrations.');
  process.exit(1);
}

const MAX_ATTEMPTS = parseInt(process.env.DB_WAIT_ATTEMPTS || '20', 10); // ~100s by default
const DELAY_MS = parseInt(process.env.DB_WAIT_DELAY_MS || '5000', 10);

async function waitForPostgres() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const client = new Client({
      connectionString: DATABASE_URL,
      connectionTimeoutMillis: 5000,
    });
    try {
      await client.connect();
      await client.end();
      console.log('Postgres is reachable.');
      return;
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.log(`Postgres not ready (attempt ${attempt}/${MAX_ATTEMPTS}): ${msg}`);
      if (attempt === MAX_ATTEMPTS) {
        throw new Error('Timed out waiting for Postgres');
      }
      await new Promise((res) => setTimeout(res, DELAY_MS));
    }
  }
}

async function runMigrations() {
  // Use compiled JS migrations inside the Docker image
  const migrationsGlob = 'dist/apps/spin-cycle/migrations/*.js';
  console.log(`Running migrations from: ${migrationsGlob}`);

  const dataSource = new DataSource({
    type: 'postgres',
    url: DATABASE_URL,
    synchronize: false,
    logging: true,
    migrationsTableName: 'migrations',
    migrations: [migrationsGlob],
  });

  try {
    await dataSource.initialize();
    const results = await dataSource.runMigrations();
    if (!results.length) {
      console.log('No migrations to run.');
    } else {
      for (const r of results) {
        console.log(`Applied migration: ${r.name}`);
      }
    }
  } finally {
    await dataSource.destroy().catch(() => {});
  }
}

(async () => {
  try {
    console.log('Waiting for Postgres to be ready...');
    await waitForPostgres();
    console.log('Running TypeORM migrations...');
    await runMigrations();
    console.log('Migrations complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
})();

