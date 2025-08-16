import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.cookie('access', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,  
    maxAge: 2 * 60 * 60 * 1000
  });
}

router.get('/csrf', (req, res) => {
  const token = (Math.random().toString(36).slice(2) + Date.now().toString(36));
  res.cookie('csrf', token, { httpOnly: false, sameSite: 'lax', secure: false, maxAge: 2 * 60 * 60 * 1000 });
  res.json({ token });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.access;
    if (!token) return res.json({ user: null });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email');
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Missing fields' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (password.length < 8) return res.status(400).json({ message: 'Password too short' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash });

    setAuthCookie(res, { sub: user._id.toString(), email: user.email, name: user.name });
    res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    setAuthCookie(res, { sub: user._id.toString(), email: user.email, name: user.name });
    res.json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  const tokenHeader = req.get('X-CSRF-Token');
  const tokenCookie = req.cookies?.csrf;
  if (!tokenHeader || tokenHeader !== tokenCookie) 
    return res.status(403).json({ message: 'CSRF token invalid' });

  res.clearCookie('access');
  res.json({ message: 'Logged out successfully' }); 
});


export default router;