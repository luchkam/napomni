import { pool } from '../db/pool.js';

export async function upsertLeadOnClick({
  telegramId,
  sourceParam = null,
  firstSection = null,
  lastSection = null
}) {
  const query = `
    INSERT INTO leads (
      telegram_id,
      source_param,
      first_section,
      last_section,
      status,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, 'new', NOW(), NOW())
    ON CONFLICT (telegram_id)
    DO UPDATE SET
      source_param = COALESCE(leads.source_param, EXCLUDED.source_param),
      first_section = COALESCE(leads.first_section, EXCLUDED.first_section),
      last_section = COALESCE(EXCLUDED.last_section, leads.last_section),
      updated_at = NOW()
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId, sourceParam, firstSection, lastSection]);
  return result.rows[0];
}

export async function markLeadAwaitingInterest(telegramId) {
  const query = `
    UPDATE leads
    SET status = 'awaiting_interest',
        updated_at = NOW()
    WHERE telegram_id = $1
      AND interest_text IS NULL
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId]);
  return result.rows[0] ?? null;
}

export async function setLeadInterest(telegramId, interestText) {
  const query = `
    UPDATE leads
    SET interest_text = $2,
        status = 'captured',
        updated_at = NOW()
    WHERE telegram_id = $1
      AND interest_text IS NULL
    RETURNING *
  `;

  const result = await pool.query(query, [telegramId, interestText]);
  return result.rows[0] ?? null;
}

export async function getLeadByTelegramId(telegramId) {
  const result = await pool.query('SELECT * FROM leads WHERE telegram_id = $1 LIMIT 1', [telegramId]);
  return result.rows[0] ?? null;
}

export async function listLeads(limit = 500) {
  const result = await pool.query('SELECT * FROM leads ORDER BY updated_at DESC LIMIT $1', [limit]);
  return result.rows;
}

export async function countLeads() {
  const result = await pool.query('SELECT COUNT(*)::int AS total FROM leads');
  return result.rows[0]?.total ?? 0;
}
