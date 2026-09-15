-- Meta Lead Ads: persistent token storage + refresh audit trail.
-- Moves the Meta Page Access Token out of env-only storage into the DB
-- (encrypted at rest) so it can be auto-refreshed by a Vercel cron job
-- before it expires, instead of requiring a manual redeploy.
-- MySQL 8 compatible. Safe to run more than once (CREATE TABLE IF NOT EXISTS).
-- Run: mysql -u <user> -p <database> < migrations/20260915_meta_token_storage.sql

-- ── 1. Current token (single active row, id = 1) ──────────────────────────────
CREATE TABLE IF NOT EXISTS dm_meta_tokens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_access_token_enc TEXT NOT NULL COMMENT 'AES-256-GCM encrypted Page Access Token, iv.tag.ciphertext base64',
  user_access_token_enc TEXT NULL COMMENT 'Optional encrypted long-lived User token, used to re-derive the Page token on refresh instead of exchanging the Page token directly',
  page_id VARCHAR(64) NULL,
  token_source ENUM('env_seed','manual','refresh') NOT NULL DEFAULT 'env_seed',
  expires_at DATETIME NULL COMMENT 'NULL = token does not expire, per Meta debug_token',
  last_checked_at DATETIME NULL,
  last_refreshed_at DATETIME NULL,
  last_refresh_status ENUM('ok','failed','skipped','never_expires') NULL,
  last_refresh_error TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. Refresh attempt history (audit trail for the cron job) ────────────────
CREATE TABLE IF NOT EXISTS dm_meta_token_refresh_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  status ENUM('ok','failed','skipped','never_expires') NOT NULL,
  message TEXT NULL,
  expires_at_before DATETIME NULL,
  expires_at_after DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mtrl_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
