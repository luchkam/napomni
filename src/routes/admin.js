import { Router } from 'express';
import { env } from '../config/env.js';
import {
  getAdminEventsHandler,
  getAdminLeadsHandler,
  getAdminStatsHandler
} from '../handlers/adminHandler.js';

const adminRouter = Router();

function getBearerToken(req) {
  const header = req.get('authorization') || '';
  if (!header.toLowerCase().startsWith('bearer ')) {
    return '';
  }
  return header.slice(7).trim();
}

function requireAdmin(req, res, next) {
  const token = getBearerToken(req);
  if (!env.adminToken || token !== env.adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

adminRouter.use(requireAdmin);
adminRouter.get('/stats', getAdminStatsHandler);
adminRouter.get('/leads', getAdminLeadsHandler);
adminRouter.get('/events', getAdminEventsHandler);

export default adminRouter;
