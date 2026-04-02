import { Router } from 'express';
import { env } from '../config/env.js';

const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.json({
    status: 'ok',
    app: env.appName,
    uptime: process.uptime()
  });
});

export default healthRouter;
