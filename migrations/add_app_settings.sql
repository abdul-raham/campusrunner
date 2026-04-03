-- Create app_settings table for admin-configurable values
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed default support email (optional)
INSERT INTO app_settings (key, value)
VALUES ('support_email', 'support@campusrunner.app')
ON CONFLICT (key) DO NOTHING;
