import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { corsMiddleware, helmetMiddleware, limiter } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import ratesRoutes from './routes/rates.js';
import txRoutes from './routes/transactions.js';

const app = express();

app.use(helmetMiddleware);
app.use(limiter);
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(corsMiddleware);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/transactions', txRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((e) => { console.error('Database connection failed', e); process.exit(1); });
