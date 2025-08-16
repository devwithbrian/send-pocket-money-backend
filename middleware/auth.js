import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  try {
    const token = req.signedCookies?.access || req.cookies?.access;
    if (!token) return res.status(401).json({ message: 'Unauthorised' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorised' });
  }
}