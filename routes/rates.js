import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

let cache = { ts: 0, data: null };
const TTL = 5 * 60 * 1000;

router.get('/', async (req, res, next) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.ts < TTL) return res.json(cache.data);

    const resp = await fetch('https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS');
    if (!resp.ok) throw new Error('Failed to fetch FX rates');
    const arr = await resp.json(); 
    const flat = {};
    for (const obj of arr) {
      const [k, v] = Object.entries(obj)[0];
      flat[k] = Number(v);
    }
    cache = { ts: now, data: flat };
    res.json(flat);
  } catch (e) { next(e); }
});

export default router;
