import {
  getUserByTelegramId,
  setCurrentSection,
  setEarlyAccessOptIn,
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
