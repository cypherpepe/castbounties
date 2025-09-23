import { Hono } from 'hono';
import { cors } from 'hono/cors';
import Database from 'better-sqlite3';
import { createServer } from 'node:http';
import { createHmac } from 'node:crypto';

const PORT = process.env.PORT || 8787;
const DB_PATH = process.env.DB_PATH || './data.db';
const API_KEY = process.env.API_KEY || '';
const SALT = process.env.SALT || 'salt';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const app = new Hono();

app.use('*', cors({ origin: CORS_ORIGIN, allowHeaders: ['Content-Type','x-api-key'] }));
app.get('/health', c => c.json({ ok: true }));

function sha256Hex(s) {
  return createHmac('sha256', SALT).update(s).digest('hex');
}

function todayRange() {
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  return [start.getTime(), end.getTime()];
}

// Get today's bounty
app.get('/bounty', c => {
  const [start, end] = todayRange();
  const row = db.prepare('SELECT id,title,hint,created_by as createdBy,created_at as createdAt FROM bounty WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC LIMIT 1').get(start, end);
  if (!row) return c.body('', 204);
  return c.json(row);
});

// Create today's bounty (author-only via API_KEY)
app.post('/bounty', async c => {
  if (c.req.header('x-api-key') !== API_KEY) return c.text('Unauthorized', 401);
  const body = await c.req.json();
  const { title, hint, secret, author } = body || {};
  if (!title || !secret || !author) return c.text('Missing fields', 400);
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const secret_hash = sha256Hex(secret);
  db.prepare('INSERT INTO bounty (id,title,hint,secret_hash,created_by,created_at) VALUES (?,?,?,?,?,?)')
    .run(id, title, hint || '', secret_hash, author, createdAt);
  return c.json({ id, title, hint, createdBy: author, createdAt });
});

// Claim
app.post('/claim', async c => {
  const body = await c.req.json();
  const { bountyId, answer, user } = body || {};
  if (!bountyId || !answer || !user) return c.text('Missing fields', 400);
  const bounty = db.prepare('SELECT secret_hash FROM bounty WHERE id = ?').get(bountyId);
  if (!bounty) return c.text('Not found', 404);
  const correct = sha256Hex(answer) === bounty.secret_hash ? 1 : 0;
  try {
    db.prepare('INSERT INTO claim (bounty_id,user,correct,at) VALUES (?,?,?,?)')
      .run(bountyId, user, correct, Date.now());
  } catch (e) {
    // duplicate: update correctness if different
    db.prepare('UPDATE claim SET correct=?, at=? WHERE bounty_id=? AND user=?')
      .run(correct, Date.now(), bountyId, user);
  }
  return c.json({ ok: true, correct: !!correct });
});

// Stats
app.get('/bounty/:id/stats', c => {
  const id = c.req.param('id');
  const total = db.prepare('SELECT COUNT(*) as n FROM claim WHERE bounty_id=?').get(id)?.n || 0;
  const correct = db.prepare('SELECT COUNT(*) as n FROM claim WHERE bounty_id=? AND correct=1').get(id)?.n || 0;
  return c.json({ total, correct });
});

const server = createServer(app.fetch);
server.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT);
});
