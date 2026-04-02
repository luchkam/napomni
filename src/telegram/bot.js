import { env } from '../config/env.js';
import { TELEGRAM_COMMANDS } from '../config/commands.js';
import { handleMediaMessage } from '../handlers/mediaHandler.js';
import { handleTextMessage } from '../handlers/textHandler.js';
import { setMyCommands, setWebhook } from '../services/telegramService.js';
import { routeCommandUpdate } from './commandRouter.js';
import { routeCallbackQuery, routeSectionTextUpdate } from './sectionRouter.js';
import { hasSupportedMedia } from './utils.js';

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, '');
}

export async function processTelegramUpdate(update) {
  if (!update || typeof update !== 'object') {
    return;
  }

  if (update.callback_query) {
    await routeCallbackQuery(update);
    return;
  }

  const message = update.message;
  if (!message) {
    return;
  }

  const commandHandled = await routeCommandUpdate(update);
  if (commandHandled) {
    return;
  }

  const sectionHandled = await routeSectionTextUpdate(update);
  if (sectionHandled) {
    return;
  }

  if (hasSupportedMedia(message)) {
    await handleMediaMessage({ update, message });
    return;
  }

  if (typeof message.text === 'string' && message.text.trim()) {
    await handleTextMessage({ update, message });
  }
}

export async function registerTelegramCommands() {
  if (!env.telegramBotToken) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN is missing; command registration skipped');
    return;
  }

  try {
    await setMyCommands(TELEGRAM_COMMANDS);
    console.log('[telegram] Commands registered');
  } catch (error) {
    console.error('[telegram] Command registration failed:', error);
  }
}

export async function setupTelegramWebhook() {
  if (!env.telegramBotToken || !env.baseUrl || !env.telegramWebhookSecret) {
    console.error('[telegram] Webhook setup skipped: missing TELEGRAM_BOT_TOKEN/BASE_URL/TELEGRAM_WEBHOOK_SECRET');
    return;
  }

  const webhookUrl = `${normalizeBaseUrl(env.baseUrl)}/telegram/webhook`;

  try {
    await setWebhook(webhookUrl, env.telegramWebhookSecret);
    console.log(`[telegram] Webhook set to ${webhookUrl}`);
  } catch (error) {
    console.error('[telegram] Webhook setup failed:', error);
  }
}
