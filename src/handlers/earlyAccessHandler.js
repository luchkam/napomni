import {
  EARLY_ACCESS_ALREADY_REPLY,
  EARLY_ACCESS_DONE_REPLY,
  EARLY_ACCESS_QUESTION
} from '../config/sections.js';
import { env } from '../config/env.js';
import { trackEvent } from '../services/analyticsService.js';
import {
  getLead,
  isAwaitingLeadInterest,
  registerLeadClick,
  saveLeadInterest
} from '../services/leadService.js';
import { sendMessage } from '../services/telegramService.js';
import { ensureUser, getUser, markEarlyAccessOptIn, updateCurrentSection } from '../services/userService.js';
import { buildEarlyAccessInlineKeyboard, buildMainReplyKeyboard, buildSectionActionsInlineKeyboard } from '../telegram/keyboards.js';

async function notifyAdminAboutCapturedLead({ from, interestText }) {
  if (!env.adminChatId) {
    return;
  }

  const fullName = [from?.first_name, from?.last_name].filter(Boolean).join(' ').trim();
  const username = from?.username ? `@${from.username}` : 'не указан';
  const leadMessage = [
    '🆕 Новая заявка на ранний доступ (бот)',
    `👤 Имя: ${fullName || 'не указано'}`,
    `🔗 Username: ${username}`,
    `🆔 Telegram ID: ${from?.id}`,
    `💬 Ответ: ${interestText}`
  ].join('\n');

  try {
    await sendMessage(env.adminChatId, leadMessage);
  } catch (error) {
    console.error('[early-access] Failed to notify admin chat:', error);
  }
}

export async function handleEarlyAccessEntry({
  update,
  chatId,
  from,
  triggerSource = 'unknown'
}) {
  if (!chatId || !from?.id) {
    return;
  }

  await ensureUser(from);
  const userBeforeUpdate = await getUser(from.id);
  await markEarlyAccessOptIn(from.id);
  await updateCurrentSection(from.id, 'early_access');

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'section_click',
    sectionKey: 'early_access',
    payload: {
      trigger_source: triggerSource,
      section_label: 'Хочу ранний доступ / 3 месяца бесплатно'
    }
  });

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'lead_click',
    sectionKey: 'early_access',
    payload: {
      trigger_source: triggerSource,
      source_param: userBeforeUpdate?.start_param ?? null
    }
  });

  const leadResult = await registerLeadClick({
    telegramId: from.id,
    sourceParam: userBeforeUpdate?.start_param ?? null,
    sectionKey: userBeforeUpdate?.current_section ?? 'early_access'
  });

  if (leadResult.state === 'already_captured') {
    await sendMessage(chatId, EARLY_ACCESS_ALREADY_REPLY, {
      replyMarkup: buildMainReplyKeyboard()
    });

    await sendMessage(chatId, 'Можно открыть другой раздел или посмотреть ещё идеи.', {
      replyMarkup: buildSectionActionsInlineKeyboard()
    });
    return;
  }

  if (leadResult.state === 'limit_reached') {
    await sendMessage(
      chatId,
      'Список раннего доступа уже заполнен. Мы сохраним ваш интерес и сообщим, когда откроем следующую волну.',
      { replyMarkup: buildMainReplyKeyboard() }
    );
    return;
  }

  await sendMessage(chatId, EARLY_ACCESS_QUESTION, {
    replyMarkup: buildMainReplyKeyboard()
  });
}

export async function maybeCaptureLeadInterest({ update, chatId, from, text }) {
  if (!chatId || !from?.id) {
    return false;
  }

  const awaiting = await isAwaitingLeadInterest(from.id);
  if (!awaiting) {
    return false;
  }

  const normalizedText = text.trim();
  if (!normalizedText) {
    await sendMessage(chatId, EARLY_ACCESS_QUESTION, {
      replyMarkup: buildMainReplyKeyboard()
    });
    return true;
  }

  const result = await saveLeadInterest({
    telegramId: from.id,
    interestText: normalizedText
  });

  if (result.state === 'captured') {
    await trackEvent({
      update,
      telegramId: from.id,
      eventType: 'lead_interest_submitted',
      sectionKey: 'early_access',
      payload: {
        interest_length: normalizedText.length
      }
    });

    await sendMessage(chatId, EARLY_ACCESS_DONE_REPLY, {
      replyMarkup: buildMainReplyKeyboard()
    });

    setImmediate(() => {
      void notifyAdminAboutCapturedLead({
        from,
        interestText: normalizedText
      });
    });

    return true;
  }

  const latestLead = await getLead(from.id);
  if (latestLead?.interest_text) {
    await sendMessage(chatId, EARLY_ACCESS_ALREADY_REPLY, {
      replyMarkup: buildEarlyAccessInlineKeyboard()
    });
    return true;
  }

  await sendMessage(chatId, EARLY_ACCESS_QUESTION, {
    replyMarkup: buildMainReplyKeyboard()
  });
  return true;
}
