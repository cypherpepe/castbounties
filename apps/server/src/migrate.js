import Database from 'better-sqlite3';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dbPath = process.env.DB_PATH || './data.db';
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS bounty (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  hint TEXT NOT NULL,
  secret_hash TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bounty_created_at ON bounty(created_at);

CREATE TABLE IF NOT EXISTS claim (
  bounty_id TEXT NOT NULL,
  user TEXT NOT NULL,
  correct INTEGER NOT NULL,
  at INTEGER NOT NULL,
  PRIMARY KEY (bounty_id, user),
  FOREIGN KEY (bounty_id) REFERENCES bounty(id)
);
`);

console.log('Migration OK');
