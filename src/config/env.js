import dotenv from 'dotenv';

dotenv.config();

function readEnv(name, fallback = '') {
  const value = process.env[name];
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return value;
}

function readInt(name, fallback) {
  const raw = readEnv(name, String(fallback));
  const num = Number.parseInt(raw, 10);
  if (Number.isNaN(num)) {
    return fallback;
  }
  return num;
}

export const env = {
  nodeEnv: readEnv('NODE_ENV', 'development'),
  port: readInt('PORT', 3000),
  appName: readEnv('APP_NAME', 'NAPOMNI Demo Bot'),

  telegramBotToken: readEnv('TELEGRAM_BOT_TOKEN'),
  telegramWebhookSecret: readEnv('TELEGRAM_WEBHOOK_SECRET'),
  telegramBotUsername: readEnv('TELEGRAM_BOT_USERNAME'),
  telegramBotId: readEnv('TELEGRAM_BOT_ID'),
  baseUrl: readEnv('BASE_URL'),

  openaiApiKey: readEnv('OPENAI_API_KEY'),
  openaiModel: readEnv('OPENAI_MODEL', 'gpt-4.1-mini'),

  databaseUrl: readEnv('DATABASE_URL'),

  adminToken: readEnv('ADMIN_TOKEN'),
  adminChatId: readEnv('ADMIN_CHAT_ID'),

  earlyAccessLimit: readInt('EARLY_ACCESS_LIMIT', 1000),
  premiumFreeMonths: readInt('PREMIUM_FREE_MONTHS', 3),
  startCardPath: readEnv('START_CARD_PATH', 'assets/start-card.png')
};

export function validateCriticalEnv() {
  const required = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_WEBHOOK_SECRET',
    'DATABASE_URL',
    'ADMIN_TOKEN',
    'BASE_URL'
  ];

  const missing = required.filter((key) => !readEnv(key));
  if (missing.length > 0) {
    console.error(`[env] Missing required vars: ${missing.join(', ')}`);
  }

  return missing;
}
