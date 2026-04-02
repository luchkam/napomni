import { trackEvent } from '../services/analyticsService.js';
import { maybeCaptureLeadInterest } from './earlyAccessHandler.js';
import { generateSectionReply } from '../services/openaiService.js';
import { sendMessage } from '../services/telegramService.js';
import { ensureUser, getUser } from '../services/userService.js';
import { buildMainReplyKeyboard, buildSectionActionsInlineKeyboard } from '../telegram/keyboards.js';

export async function handleTextMessage({ update, message }) {
  const text = message?.text?.trim();
  const chatId = message?.chat?.id;
  const from = message?.from;

  if (!text || !chatId || !from?.id) {
    return;
  }

  await ensureUser(from);

  const capturedLead = await maybeCaptureLeadInterest({
    update,
    chatId,
    from,
    text
  });

  if (capturedLead) {
    return;
  }

  const user = await getUser(from.id);
  const sectionKey = user?.current_section || 'what_can_do';

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'user_text',
    sectionKey: user?.current_section ?? null,
    payload: {
      text_preview: text.slice(0, 140)
    }
  });

  const responseText = await generateSectionReply({
    sectionKey,
    userText: text,
    userProfile: user,
    mode: user?.current_section ? 'section_text' : 'general_demo'
  });

  await sendMessage(chatId, responseText, {
    replyMarkup: buildMainReplyKeyboard()
  });

  await sendMessage(chatId, 'Если хотите, могу показать другой раздел или записать вас в ранний доступ.', {
    replyMarkup: buildSectionActionsInlineKeyboard()
  });
}
