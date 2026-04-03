import { pool } from '../db/pool.js';

export async function upsertUserFromTelegram({
  telegramId,
  username,
  firstName,
  lastName,
  languageCode,
  startParam = null
}) {
  const query = `
    INSERT INTO users (
      telegram_id,
      username,
      first_name,
      last_name,
      language_code,
      start_param,
      first_seen_at,
      last_seen_at,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW(), NOW())
    ON CONFLICT (telegram_id)
    DO UPDATE SET
      username = EXCLUDED.username,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      language_code = EXCLUDED.language_code,
      start_param = COALESCE(EXCLUDED.start_param, users.start_param),
      last_seen_at = NOW(),
      updated_at = NOW()
    RETURNING *
  `;

  const values = [
    telegramId,
    username ?? null,
    firstName ?? null,
    lastName ?? null,
    languageCode ?? null,
    startParam
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getUserByTelegramId(telegramId) {
  const result = await pool.query('SELECT * FROM users WHERE telegram_id = $1 LIMIT 1', [telegramId]);
  return result.rows[0] ?? null;
}

export async function setCurrentSection(telegramId, sectionKey) {
  const query = `
    UPDATE users
    SET current_section = $2,
        last_seen_at = NOW(),
        updated_at = NOW()
    WHERE telegram_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId, sectionKey]);
  return result.rows[0] ?? null;
}

export async function setEarlyAccessOptIn(telegramId) {
  const query = `
    UPDATE users
    SET early_access_opt_in_at = COALESCE(early_access_opt_in_at, NOW()),
        updated_at = NOW()
    WHERE telegram_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId]);
  return result.rows[0] ?? null;
}

export async function touchUser(telegramId) {
  const query = `
    UPDATE users
    SET last_seen_at = NOW(),
        updated_at = NOW()
    WHERE telegram_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId]);
  return result.rows[0] ?? null;
}

export async function reserveStartSendWindow(telegramId, cooldownSeconds = 10) {
  const query = `
    UPDATE users
    SET last_start_sent_at = NOW(),
        updated_at = NOW()
    WHERE telegram_id = $1
      AND (
        last_start_sent_at IS NULL
        OR last_start_sent_at < NOW() - ($2::text || ' seconds')::interval
      )
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId, cooldownSeconds]);
  return result.rows[0] ?? null;
}

export async function setOpenAiConversationId(telegramId, conversationId) {
  const query = `
    UPDATE users
    SET openai_conversation_id = $2,
        updated_at = NOW()
    WHERE telegram_id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId, conversationId]);
  return result.rows[0] ?? null;
}
