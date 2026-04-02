import { pool } from '../db/pool.js';

export async function logEvent({
  telegramId = null,
  updateId = null,
  eventType,
  sectionKey = null,
  payload = {}
}) {
  const query = `
    INSERT INTO events (
      telegram_id,
      update_id,
      event_type,
      section_key,
      payload,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5::jsonb, NOW())
    RETURNING *
  `;

  const result = await pool.query(query, [
    telegramId,
    updateId,
    eventType,
    sectionKey,
    JSON.stringify(payload ?? {})
  ]);

  return result.rows[0];
}

export async function listRecentEvents(limit = 100) {
  const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC LIMIT $1', [limit]);
  return result.rows;
}
