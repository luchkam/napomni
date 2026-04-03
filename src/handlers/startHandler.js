import { env } from '../config/env.js';
import { START_TEXT } from '../config/sections.js';
import { trackEvent } from '../services/analyticsService.js';
import { sendMessage, sendPhotoFromPath } from '../services/telegramService.js';
import { ensureUser, markStartSentNow } from '../services/userService.js';
import { buildEarlyAccessInlineKeyboard, buildMainReplyKeyboard } from '../telegram/keyboards.js';

const START_DEBOUNCE_SECONDS = 3;
const START_DEBOUNCE_MS = START_DEBOUNCE_SECONDS * 1000;

function shouldDebounceStart(lastStartSentAt) {
  if (!lastStartSentAt) {
    return false;
  }

  const lastSentMs = new Date(lastStartSentAt).getTime();
  if (Number.isNaN(lastSentMs)) {
    return false;
  }

  return Date.now() - lastSentMs < START_DEBOUNCE_MS;
}

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

  if (shouldDebounceStart(user?.last_start_sent_at)) {
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

  await markStartSentNow(from.id);

  return user;
}
