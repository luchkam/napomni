import { EARLY_ACCESS_MEDIA_REPLY } from '../config/sections.js';
import { trackEvent } from '../services/analyticsService.js';
import { sendMessage } from '../services/telegramService.js';
import { ensureUser } from '../services/userService.js';
import { buildEarlyAccessInlineKeyboard, buildMainReplyKeyboard } from '../telegram/keyboards.js';
import { detectMediaType } from '../telegram/utils.js';

export async function handleMediaMessage({ update, message }) {
  const chatId = message?.chat?.id;
  const from = message?.from;

  if (!chatId || !from?.id) {
    return;
  }

  await ensureUser(from);

  const mediaType = detectMediaType(message);

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'unsupported_media',
    payload: {
      media_type: mediaType
    }
  });

  await sendMessage(chatId, EARLY_ACCESS_MEDIA_REPLY, {
    replyMarkup: buildMainReplyKeyboard()
  });

  await sendMessage(chatId, 'Оставить заявку на ранний доступ:', {
    replyMarkup: buildEarlyAccessInlineKeyboard()
  });
}
