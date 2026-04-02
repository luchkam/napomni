import express from 'express';
import adminRouter from './routes/admin.js';
import healthRouter from './routes/health.js';
import telegramWebhookRouter from './routes/telegramWebhook.js';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_req, res) => {
    res.json({ ok: true, service: 'napomni-demo-bot' });
  });

  app.use(healthRouter);
  app.use('/admin', adminRouter);
  app.use('/telegram', telegramWebhookRouter);

  return app;
}
