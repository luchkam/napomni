CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT,
  start_param TEXT,
  current_section TEXT,
  early_access_opt_in_at TIMESTAMPTZ NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  source_param TEXT,
  first_section TEXT,
  last_section TEXT,
  interest_text TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT NULL,
  update_id BIGINT NULL,
  event_type TEXT NOT NULL,
  section_key TEXT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telegram_updates (
  update_id BIGINT PRIMARY KEY,
  raw_json JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users (telegram_id);
CREATE INDEX IF NOT EXISTS idx_leads_telegram_id ON leads (telegram_id);
CREATE INDEX IF NOT EXISTS idx_events_telegram_id ON events (telegram_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events (event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at);
