import { env } from '../config/env.js';

export function parseCommand(text) {
  if (!text || typeof text !== 'string' || !text.startsWith('/')) {
    return null;
  }

  const [rawCommand, ...args] = text.trim().split(/\s+/);
  const commandPart = rawCommand.slice(1);

  if (!commandPart) {
    return null;
  }

  let command = commandPart;
  if (commandPart.includes('@')) {
    const [baseCommand, mention] = commandPart.split('@');
    if (env.telegramBotUsername && mention.toLowerCase() !== env.telegramBotUsername.toLowerCase()) {
      return null;
    }
    command = baseCommand;
  }

  return {
    command: command.toLowerCase(),
    args
  };
}

export function hasSupportedMedia(message = {}) {
  return Boolean(
    message.photo || message.video || message.voice || message.audio || message.document
  );
}

export function detectMediaType(message = {}) {
  if (message.photo) {
    return 'photo';
  }
  if (message.video) {
    return 'video';
  }
  if (message.voice) {
    return 'voice';
  }
  if (message.audio) {
    return 'audio';
  }
  if (message.document) {
    return 'document';
  }
  return 'unknown';
}

export function getUpdateTelegramId(update) {
  return (
    update?.message?.from?.id ||
    update?.callback_query?.from?.id ||
    null
  );
}

export function getUpdateChatId(update) {
  return (
    update?.message?.chat?.id ||
    update?.callback_query?.message?.chat?.id ||
    null
  );
}
