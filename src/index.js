import { createApp } from './app.js';
import { env, validateCriticalEnv } from './config/env.js';
import { pool } from './db/pool.js';
import { runMigrations } from './db/migrate.js';
import { registerTelegramCommands, setupTelegramWebhook } from './telegram/bot.js';

async function bootstrap() {
  validateCriticalEnv();

  await runMigrations();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[bootstrap] ${env.appName} listening on port ${env.port}`);
  });

  await registerTelegramCommands();
  await setupTelegramWebhook();
}

bootstrap().catch(async (error) => {
  console.error('[bootstrap] Startup failed:', error);
  await pool.end().catch(() => {});
  process.exit(1);
});
