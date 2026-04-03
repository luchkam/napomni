import { trackEvent } from '../services/analyticsService.js';
import { maybeCaptureLeadInterest } from './earlyAccessHandler.js';
import { generateSectionReply } from '../services/openaiService.js';
import { sendMessage } from '../services/telegramService.js';
import { ensureUser, getUser, updateOpenAiConversationId } from '../services/userService.js';
import { buildSectionActionsInlineKeyboard } from '../telegram/keyboards.js';

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

  const response = await generateSectionReply({
    sectionKey,
    userText: text,
    userProfile: user,
    mode: user?.current_section ? 'section_text' : 'general_demo'
  });

  if (response.conversationId !== (user?.openai_conversation_id ?? null)) {
    await updateOpenAiConversationId(from.id, response.conversationId ?? null);
  }

  await sendMessage(chatId, response.text, {
    replyMarkup: buildSectionActionsInlineKeyboard()
  });
}
