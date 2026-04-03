import express, { Router } from 'express';
import path from 'node:path';
import { env } from '../config/env.js';
import { sendMessage } from '../services/telegramService.js';

const landingRouter = Router();
const landingPublicPath = path.resolve(process.cwd(), 'napomni-landing/public');

landingRouter.use('/landing', express.static(landingPublicPath));

function normalizeField(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

landingRouter.post('/api/subscribe', async (req, res) => {
  const phone = normalizeField(req.body?.phone, 64);
  const email = normalizeField(req.body?.email, 128);

  if (!phone && !email) {
    return res.status(400).json({ success: false, error: 'Phone or email is required' });
  }

  if (!env.adminChatId) {
    return res.status(500).json({ success: false, error: 'Lead destination is not configured' });
  }

  const leadMessage = [
    '🆕 Новая заявка NAPOMNI (лендинг)',
    `📱 Телефон: ${phone || 'не указан'}`,
    `📧 Email: ${email || 'не указан'}`
  ].join('\n');

  try {
    await sendMessage(env.adminChatId, leadMessage);
    return res.json({ success: true });
  } catch (error) {
    console.error('[landing] Failed to send lead message:', error);
    return res.status(500).json({ success: false });
  }
});

export default landingRouter;
