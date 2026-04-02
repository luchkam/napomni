import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '../config/env.js';

function ensureBotToken() {
  if (!env.telegramBotToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is missing');
  }
}

function getApiUrl(method) {
  ensureBotToken();
  return `https://api.telegram.org/bot${env.telegramBotToken}/${method}`;
}

async function parseTelegramResponse(method, response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(
      `[telegram] ${method} failed (${response.status}): ${JSON.stringify(payload)}`
    );
  }
  return payload.result;
}

export async function callTelegramJson(method, body) {
  const response = await fetch(getApiUrl(method), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });

  return parseTelegramResponse(method, response);
}

export async function callTelegramMultipart(method, formData) {
  const response = await fetch(getApiUrl(method), {
    method: 'POST',
    body: formData
  });

  return parseTelegramResponse(method, response);
}

export async function sendMessage(chatId, text, options = {}) {
  const body = {
    chat_id: chatId,
    text,
    disable_web_page_preview: true
  };

  if (options.replyMarkup) {
    body.reply_markup = options.replyMarkup;
  }

  return callTelegramJson('sendMessage', body);
}

export async function sendPhotoFromPath(chatId, filePath, options = {}) {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  const fileBuffer = await fs.readFile(absolutePath);

  const form = new FormData();
  form.append('chat_id', String(chatId));
  form.append('photo', new Blob([fileBuffer]), path.basename(absolutePath));

  if (options.caption) {
    form.append('caption', options.caption);
  }

  if (options.replyMarkup) {
    form.append('reply_markup', JSON.stringify(options.replyMarkup));
  }

  return callTelegramMultipart('sendPhoto', form);
}

export async function answerCallbackQuery(callbackQueryId, text = '') {
  const body = {
    callback_query_id: callbackQueryId
  };

  if (text) {
    body.text = text;
  }

  return callTelegramJson('answerCallbackQuery', body);
}

export async function setMyCommands(commands) {
  return callTelegramJson('setMyCommands', {
    commands
  });
}

export async function setWebhook(url, secretToken) {
  return callTelegramJson('setWebhook', {
    url,
    secret_token: secretToken,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: false
  });
}
