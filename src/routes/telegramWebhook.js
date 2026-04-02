import { Router } from 'express';
import { env } from '../config/env.js';
import { saveUpdateIfNew } from '../repos/updatesRepo.js';
import { processTelegramUpdate } from '../telegram/bot.js';

const telegramWebhookRouter = Router();

telegramWebhookRouter.post('/webhook', async (req, res) => {
  const secretToken = req.get('x-telegram-bot-api-secret-token');
  if (!env.telegramWebhookSecret || secretToken !== env.telegramWebhookSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const update = req.body ?? {};
  const updateId = typeof update.update_id === 'number' ? update.update_id : null;

  try {
    const isNew = await saveUpdateIfNew(updateId, update);
    if (!isNew) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    res.status(200).json({ ok: true });

    setImmediate(async () => {
      try {
        await processTelegramUpdate(update);
      } catch (error) {
        console.error('[telegram] Update processing failed:', error);
      }
    });

    return undefined;
  } catch (error) {
    console.error('[telegram] Webhook handling failed:', error);
    return res.status(200).json({ ok: true });
  }
});

export default telegramWebhookRouter;
