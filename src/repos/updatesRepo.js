import { pool } from '../db/pool.js';

export async function saveUpdateIfNew(updateId, rawJson) {
  if (typeof updateId !== 'number' || Number.isNaN(updateId)) {
    return true;
  }

  const query = `
    INSERT INTO telegram_updates (update_id, raw_json, received_at)
    VALUES ($1, $2::jsonb, NOW())
    ON CONFLICT (update_id) DO NOTHING
    RETURNING update_id
  `;

  const result = await pool.query(query, [updateId, JSON.stringify(rawJson)]);
  return result.rowCount > 0;
}
