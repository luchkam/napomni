import { pool } from '../db/pool.js';
import { logEvent, listRecentEvents } from '../repos/eventsRepo.js';

export async function trackEvent({
  update = null,
  telegramId = null,
  eventType,
  sectionKey = null,
  payload = {}
}) {
  return logEvent({
    telegramId,
    updateId: update?.update_id ?? null,
    eventType,
    sectionKey,
    payload
  });
}

export async function getAdminStats() {
  const [usersTotal, startsTotal, leadsTotal, earlyAccessTotal, sectionClicksTop, startsBySource, leadsBySource] =
    await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total FROM users'),
      pool.query("SELECT COUNT(*)::int AS total FROM events WHERE event_type = 'bot_start'"),
      pool.query('SELECT COUNT(*)::int AS total FROM leads'),
      pool.query('SELECT COUNT(*)::int AS total FROM users WHERE early_access_opt_in_at IS NOT NULL'),
      pool.query(
        `SELECT COALESCE(section_key, 'unknown') AS key, COUNT(*)::int AS total
         FROM events
         WHERE event_type = 'section_click'
         GROUP BY COALESCE(section_key, 'unknown')
         ORDER BY total DESC
         LIMIT 10`
      ),
      pool.query(
        `SELECT COALESCE(start_param, 'unknown') AS source, COUNT(*)::int AS total
         FROM users
         GROUP BY COALESCE(start_param, 'unknown')
         ORDER BY total DESC
         LIMIT 20`
      ),
      pool.query(
        `SELECT COALESCE(source_param, 'unknown') AS source, COUNT(*)::int AS total
         FROM leads
         GROUP BY COALESCE(source_param, 'unknown')
         ORDER BY total DESC
         LIMIT 20`
      )
    ]);

  return {
    users_total: usersTotal.rows[0]?.total ?? 0,
    starts_total: startsTotal.rows[0]?.total ?? 0,
    leads_total: leadsTotal.rows[0]?.total ?? 0,
    early_access_total: earlyAccessTotal.rows[0]?.total ?? 0,
    section_clicks_top: sectionClicksTop.rows,
    starts_by_source: startsBySource.rows,
    leads_by_source: leadsBySource.rows
  };
}

export async function getRecentEvents(limit = 100) {
  return listRecentEvents(limit);
}
