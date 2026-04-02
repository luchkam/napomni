import { getSectionByKey } from '../config/sections.js';
import { trackEvent } from '../services/analyticsService.js';
import { generateSectionReply } from '../services/openaiService.js';
import { sendMessage } from '../services/telegramService.js';
import { ensureUser, getUser, updateCurrentSection } from '../services/userService.js';
import { buildMainReplyKeyboard, buildSectionActionsInlineKeyboard, buildSectionPickerInlineKeyboard } from '../telegram/keyboards.js';
import { handleEarlyAccessEntry } from './earlyAccessHandler.js';

async function sendSectionReply(chatId, text) {
  await sendMessage(chatId, text, { replyMarkup: buildMainReplyKeyboard() });
  await sendMessage(chatId, 'Дальше можно открыть другой раздел или оставить заявку на ранний доступ.', {
    replyMarkup: buildSectionActionsInlineKeyboard()
  });
}

export async function handleSectionSelection({
  update,
  message,
  sectionKey,
  triggerSource = 'unknown',
  fromOverride = null
}) {
  const chatId = message?.chat?.id;
  const from = fromOverride ?? message?.from;

  if (!chatId || !from?.id) {
    return;
  }

  const section = getSectionByKey(sectionKey);
  if (!section) {
    await sendMessage(chatId, 'Раздел не найден. Выберите другой:', {
      replyMarkup: buildSectionPickerInlineKeyboard()
    });
    return;
  }

  if (section.sectionKey === 'early_access' || section.isLeadCTA) {
    await handleEarlyAccessEntry({
      update,
      chatId,
      from,
      triggerSource
    });
    return;
  }

  await ensureUser(from);
  await updateCurrentSection(from.id, section.sectionKey);

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'section_click',
    sectionKey: section.sectionKey,
    payload: {
      trigger_source: triggerSource,
      section_label: section.label
    }
  });

  const userProfile = await getUser(from.id);
  const userText = message?.text?.trim() ?? '';

  const responseText = await generateSectionReply({
    sectionKey: section.sectionKey,
    userText,
    userProfile,
    mode: 'section'
  });

  await sendSectionReply(chatId, responseText);
}

export async function handleShowMore({ update, chatId, from }) {
  if (!chatId || !from?.id) {
    return;
  }

  await ensureUser(from);

  const userProfile = await getUser(from.id);
  const activeSection = userProfile?.current_section;

  if (!activeSection) {
    await sendMessage(chatId, 'Сначала выберите раздел:', {
      replyMarkup: buildSectionPickerInlineKeyboard()
    });
    return;
  }

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'show_more_click',
    sectionKey: activeSection,
    payload: { trigger_source: 'inline_button' }
  });

  const responseText = await generateSectionReply({
    sectionKey: activeSection,
    userText: 'Покажи больше примеров для этого раздела',
    userProfile,
    mode: 'show_more'
  });

  await sendSectionReply(chatId, responseText);
}
