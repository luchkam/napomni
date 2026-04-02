import { COMMAND_TO_SECTION_KEY } from '../config/commands.js';
import { trackEvent } from '../services/analyticsService.js';
import { sendMessage } from '../services/telegramService.js';
import { handleSectionSelection } from './sectionHandler.js';
import { buildMainReplyKeyboard } from '../telegram/keyboards.js';

export async function handleCommand({ update, message, command, args = [] }) {
  const chatId = message?.chat?.id;
  const from = message?.from;

  if (!chatId || !from?.id) {
    return;
  }

  const sectionKey = COMMAND_TO_SECTION_KEY[command];

  await trackEvent({
    update,
    telegramId: from.id,
    eventType: 'command_used',
    sectionKey: sectionKey ?? null,
    payload: {
      command,
      args
    }
  });

  if (!sectionKey) {
    await sendMessage(
      chatId,
      'Команда не распознана. Используйте /help или кнопки внизу.',
      { replyMarkup: buildMainReplyKeyboard() }
    );
    return;
  }

  await handleSectionSelection({
    update,
    message,
    sectionKey,
    triggerSource: 'command'
  });
}
