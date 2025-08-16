import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import { authRequired } from '../middleware/auth.js';
import { ceilToCents, roundUpMinorUnits } from '../utils/money.js';
import fetch from 'node-fetch';

const router = Router();
 
const FEES = { GBP: 0.10, ZAR: 0.20 };
const MIN_USD = 5;
const MAX_USD = 2000;

async function getRates() {
  const r = await fetch('http://localhost:4000/api/rates');  
  if (!r.ok) throw new Error('FX rates unavailable');
  return r.json();
}

router.post('/', authRequired, async (req, res, next) => {
  try {
    const { currency, amountUSD_cents, recipientName, note } = req.body || {};
    if (!['GBP', 'ZAR'].includes(currency)) return res.status(400).json({ message: 'Unsupported currency' });
    if (!recipientName?.trim()) return res.status(400).json({ message: 'Recipient name required' });

    const amountCents = Number(amountUSD_cents);
    if (!Number.isInteger(amountCents) || amountCents <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const usd = amountCents / 100;
    if (usd < MIN_USD) return res.status(400).json({ message: `Minimum is $${MIN_USD.toFixed(2)}` });
    if (usd > MAX_USD) return res.status(400).json({ message: `Maximum is $${MAX_USD.toFixed(2)}` });

    const rates = await getRates();
    const rate = Number(rates[currency]);
    if (!Number.isFinite(rate) || rate <= 0) return res.status(400).json({ message: 'Rate unavailable' });

    const fee = ceilToCents(usd * FEES[currency]);       
    const netUsdCents = Math.max(0, amountCents - fee);
    const recipientMinor = roundUpMinorUnits(netUsdCents, rate);  

    const tx = await Transaction.create({
      userId: req.user.id,
      recipientName: recipientName.trim(),
      note: (note || '').trim(),
      currency,
      amountUSD: amountCents,
      feeUSD: fee,
      fxRate: rate,
      amountRecipientMinor: recipientMinor,
      status: 'created'
    });

    res.status(201).json(tx);
  } catch (e) { next(e); }
});

router.get('/', authRequired, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(20, Math.max(5, parseInt(req.query.pageSize || '5', 10)));
    const q = { userId: req.user.id };
    const total = await Transaction.countDocuments(q);
    const items = await Transaction.find(q).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean();
    res.json({ page, pageSize, total, items });
  } catch (e) { next(e); }
});

export default router;
