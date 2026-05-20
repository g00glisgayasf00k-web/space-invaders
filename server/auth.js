import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const TOKEN_DAYS = 30;

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: `${TOKEN_DAYS}d` }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Login required' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired — please log in again' });
    return;
  }
  req.user = payload;
  next();
}

export function registerUser({ username, email, password }) {
  const name = String(username).trim();
  const mail = String(email).trim().toLowerCase();
  const pass = String(password);

  if (name.length < 2 || name.length > 16) {
    throw new Error('Username must be 2–16 characters');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    throw new Error('Invalid email address');
  }
  if (pass.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const hash = bcrypt.hashSync(pass, 10);
  try {
    const result = db
      .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
      .run(name, mail, hash);
    const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(result.lastInsertRowid);
    return { user, token: signToken(user) };
  } catch (e) {
    if (e.message.includes('UNIQUE')) {
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(mail)) {
        throw new Error('Email already registered');
      }
      throw new Error('Username already taken');
    }
    throw e;
  }
}

export function loginUser({ email, password }) {
  const mail = String(email).trim().toLowerCase();
  const pass = String(password);
  const row = db.prepare('SELECT id, username, email, password_hash FROM users WHERE email = ?').get(mail);
  if (!row || !bcrypt.compareSync(pass, row.password_hash)) {
    throw new Error('Invalid email or password');
  }
  const user = { id: row.id, username: row.username, email: row.email };
  return { user, token: signToken(user) };
}

export function getUserById(id) {
  return db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(id);
}
