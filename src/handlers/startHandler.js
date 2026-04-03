import { env } from '../config/env.js';
import { START_TEXT } from '../config/sections.js';
import { trackEvent } from '../services/analyticsService.js';
import { sendMessage, sendPhotoFromPath } from '../services/telegramService.js';
import { canSendStartNow, ensureUser } from '../services/userService.js';
import { buildEarlyAccessInlineKeyboard, buildMainReplyKeyboard } from '../telegram/keyboards.js';

const START_DEBOUNCE_SECONDS = 10;

async function trySendStartCard(chatId) {
  if (!env.startCardPath) {
    return;
  }

  try {
    await sendPhotoFromPath(chatId, env.startCardPath);
  } catch (error) {
    console.error('[start] Failed to send start card, continuing without image:', error.message);
  }
}

export async function handleStartCommand({ update, message, startParam = null }) {
  const chatId = message?.chat?.id;
  const from = message?.from;

  if (!chatId || !from?.id) {
    return;
  }

  const user = await ensureUser(from, { startParam });

  const canSendStart = await canSendStartNow(from.id, START_DEBOUNCE_SECONDS);
  if (!canSendStart) {
    await trackEvent({
      update,
      telegramId: from.id,
      eventType: 'bot_start_debounced',
      payload: {
        start_param: startParam,
        debounce_seconds: START_DEBOUNCE_SECONDS
      }
    });
    return user;
  }

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'bot_start',
    payload: {
      start_param: startParam,
      username: from.username ?? null
    }
  });

  await trySendStartCard(chatId);

  await sendMessage(chatId, START_TEXT, {
    replyMarkup: buildMainReplyKeyboard()
  });

  await sendMessage(chatId, 'Если хотите приоритетный доступ, оставьте заявку ниже:', {
    replyMarkup: buildEarlyAccessInlineKeyboard()
  });

  return user;
}
