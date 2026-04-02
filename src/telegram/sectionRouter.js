import { getSectionByKey, getSectionByLabel } from '../config/sections.js';
import {
  CALLBACK_ACTIONS,
  buildMainReplyKeyboard,
  buildSectionPickerInlineKeyboard
} from './keyboards.js';
import { answerCallbackQuery, sendMessage } from '../services/telegramService.js';
import { handleSectionSelection, handleShowMore } from '../handlers/sectionHandler.js';
import { handleEarlyAccessEntry } from '../handlers/earlyAccessHandler.js';

export async function routeSectionTextUpdate(update) {
  const message = update?.message;
  const text = message?.text?.trim();

  if (!text) {
    return false;
  }

  const section = getSectionByLabel(text);
  if (!section) {
    return false;
  }

  if (section.sectionKey === 'early_access') {
    await handleEarlyAccessEntry({
      update,
      chatId: message.chat.id,
      from: message.from,
      triggerSource: 'reply_keyboard'
    });
    return true;
  }

  await handleSectionSelection({
    update,
    message,
    sectionKey: section.sectionKey,
    triggerSource: 'reply_keyboard'
  });
  return true;
}

export async function routeCallbackQuery(update) {
  const callbackQuery = update?.callback_query;
  if (!callbackQuery?.data) {
    return false;
  }

  const callbackData = callbackQuery.data;
  const chatId = callbackQuery?.message?.chat?.id;

  try {
    if (callbackData === CALLBACK_ACTIONS.EARLY_ACCESS) {
      await handleEarlyAccessEntry({
        update,
        chatId,
        from: callbackQuery.from,
        triggerSource: 'inline_button'
      });
      return true;
    }

    if (callbackData === CALLBACK_ACTIONS.OPEN_SECTIONS) {
      await sendMessage(chatId, 'Выберите другой раздел:', {
        replyMarkup: buildSectionPickerInlineKeyboard()
      });
      return true;
    }

    if (callbackData === CALLBACK_ACTIONS.SHOW_MORE) {
      await handleShowMore({
        update,
        chatId,
        from: callbackQuery.from
      });
      return true;
    }

    if (callbackData.startsWith(CALLBACK_ACTIONS.SECTION_PREFIX)) {
      const sectionKey = callbackData.replace(CALLBACK_ACTIONS.SECTION_PREFIX, '');
      const section = getSectionByKey(sectionKey);
      if (!section) {
        await sendMessage(chatId, 'Этот раздел пока недоступен.', {
          replyMarkup: buildMainReplyKeyboard()
        });
        return true;
      }

      await handleSectionSelection({
        update,
        message: callbackQuery.message,
        sectionKey,
        triggerSource: 'inline_section_picker',
        fromOverride: callbackQuery.from
      });
      return true;
    }

    return false;
  } finally {
    await answerCallbackQuery(callbackQuery.id).catch((error) => {
      console.error('[telegram] answerCallbackQuery failed:', error);
    });
  }
}
