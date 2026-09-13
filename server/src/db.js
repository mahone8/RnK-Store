// PostgreSQL connection pool
// Developer: levelose.tech
//
// Supports two connection modes:
//  1. DATABASE_URL (recommended for Neon / any hosted Postgres) — a single
//     connection string, with SSL enabled automatically.
//  2. Individual PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD vars — used for
//     plain local Postgres with no SSL.
require('dotenv').config();
const { Pool } = require('pg');

const usingConnectionString = !!process.env.DATABASE_URL;

const pool = usingConnectionString
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Neon (and most hosted Postgres providers) require SSL. Neon's
      // certificates are trusted, but node's default verification can fail
      // through some connection poolers, so we relax verification here.
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD
    });

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error', err);
  process.exit(1);
});

pool.on('connect', () => {
  if (usingConnectionString) {
    console.log('Connected to Postgres via DATABASE_URL (SSL enabled)');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
