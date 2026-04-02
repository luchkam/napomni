import { getAdminStats, getRecentEvents } from '../services/analyticsService.js';
import { listLeads } from '../repos/leadsRepo.js';

export async function getAdminStatsHandler(_req, res) {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('[admin] stats failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getAdminLeadsHandler(_req, res) {
  try {
    const leads = await listLeads(1000);
    res.json({ leads });
  } catch (error) {
    console.error('[admin] leads failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getAdminEventsHandler(_req, res) {
  try {
    const events = await getRecentEvents(100);
    res.json({ events });
  } catch (error) {
    console.error('[admin] events failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
