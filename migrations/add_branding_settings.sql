-- Add new branding/monetization settings keys
INSERT INTO app_settings (key, value)
VALUES
  ('app_name',   'CampusRunner'),
  ('logo_url',   ''),
  ('currency',   'NGN')
ON CONFLICT (key) DO NOTHING;
