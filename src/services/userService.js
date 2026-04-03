import {
  getUserByTelegramId,
  reserveStartSendWindow,
  setCurrentSection,
  setEarlyAccessOptIn,
  setOpenAiConversationId,
  touchUser,
  upsertUserFromTelegram
} from '../repos/usersRepo.js';

export async function ensureUser(from, options = {}) {
  if (!from?.id) {
    return null;
  }

  return upsertUserFromTelegram({
    telegramId: from.id,
    username: from.username ?? null,
    firstName: from.first_name ?? null,
    lastName: from.last_name ?? null,
    languageCode: from.language_code ?? null,
    startParam: options.startParam ?? null
  });
}

export async function getUser(telegramId) {
  return getUserByTelegramId(telegramId);
}

export async function updateCurrentSection(telegramId, sectionKey) {
  return setCurrentSection(telegramId, sectionKey);
}

export async function markEarlyAccessOptIn(telegramId) {
  return setEarlyAccessOptIn(telegramId);
}

export async function touchUserActivity(telegramId) {
  return touchUser(telegramId);
}

export async function canSendStartNow(telegramId, cooldownSeconds = 10) {
  const reserved = await reserveStartSendWindow(telegramId, cooldownSeconds);
  return Boolean(reserved);
}

export async function updateOpenAiConversationId(telegramId, conversationId) {
  return setOpenAiConversationId(telegramId, conversationId);
}
