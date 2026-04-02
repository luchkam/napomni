import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

const sslEnabled = env.nodeEnv === 'production';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false
});

pool.on('error', (error) => {
  console.error('[db] Unexpected pool error:', error);
});
