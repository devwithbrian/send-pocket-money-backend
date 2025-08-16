import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const corsMiddleware = cors({
  origin: ['http://localhost:5173'],
  credentials: true
});

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
