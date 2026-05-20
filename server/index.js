import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import {
  authMiddleware,
  registerUser,
  loginUser,
  getUserById,
} from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/register', (req, res) => {
  try {
    const data = registerUser(req.body);
    res.json({
      token: data.token,
      user: { id: data.user.id, username: data.user.username, email: data.user.email },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const data = loginUser(req.body);
    res.json({
      token: data.token,
      user: { id: data.user.id, username: data.user.username, email: data.user.email },
    });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = getUserById(req.user.sub);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: { id: user.id, username: user.username, email: user.email } });
});

app.post('/api/scores', authMiddleware, (req, res) => {
  const score = parseInt(req.body.score, 10);
  const level = parseInt(req.body.level, 10) || 1;
  if (!Number.isFinite(score) || score < 0) {
    res.status(400).json({ error: 'Invalid score' });
    return;
  }
  db.prepare('INSERT INTO scores (user_id, score, level) VALUES (?, ?, ?)').run(
    req.user.sub,
    score,
    level
  );
  const best = db
    .prepare('SELECT MAX(score) AS best FROM scores WHERE user_id = ?')
    .get(req.user.sub);
  res.json({ ok: true, personalBest: best.best });
});

app.get('/api/leaderboard', (req, res) => {
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const rows = db
    .prepare(
      `SELECT u.username, MAX(s.score) AS score, MAX(s.level) AS level,
              MAX(s.created_at) AS played_at
       FROM scores s
       JOIN users u ON u.id = s.user_id
       GROUP BY s.user_id
       ORDER BY score DESC
       LIMIT ?`
    )
    .all(limit);

  res.json({
    leaderboard: rows.map((r, i) => ({
      rank: i + 1,
      username: r.username,
      score: r.score,
      level: r.level,
      playedAt: r.played_at,
    })),
  });
});

app.get('/api/leaderboard/me', authMiddleware, (req, res) => {
  const best = db
    .prepare('SELECT MAX(score) AS score FROM scores WHERE user_id = ?')
    .get(req.user.sub);
  const rankRow = db
    .prepare(
      `SELECT COUNT(*) + 1 AS rank FROM (
         SELECT user_id, MAX(score) AS best FROM scores GROUP BY user_id
       ) WHERE best > ?`
    )
    .get(best?.score || 0);
  res.json({
    rank: best?.score > 0 ? rankRow.rank : null,
    personalBest: best?.score || 0,
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, online: true });
});

app.use(express.static(root));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.sendFile(path.join(root, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Space Invaders server http://localhost:${PORT}`);
});
