-- Gmail Integration — full inbox mirror + lead activity logging
-- MySQL 8 compatible. Safe to run more than once (CREATE TABLE IF NOT EXISTS).
-- Run: mysql -u <user> -p <database> < migrations/20260905_gmail_integration.sql

-- ── 1. Integration Settings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gmail_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  is_enabled TINYINT(1) NOT NULL DEFAULT 0,
  backfill_days INT UNSIGNED NOT NULL DEFAULT 90,
  backfill_message_cap INT UNSIGNED NOT NULL DEFAULT 1000,
  employees_per_sync_tick INT UNSIGNED NOT NULL DEFAULT 20,
  last_cron_run_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO dm_gmail_settings (id, is_enabled) VALUES (1, 0);

-- ── 2. Per-Employee Mailbox Connection / Sync State ─────────────────────────
CREATE TABLE IF NOT EXISTS dm_gmail_accounts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  mailbox_email VARCHAR(255) NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 0,
  history_id VARCHAR(64) NULL COMMENT 'Gmail historyId cursor for incremental sync',
  backfill_page_token VARCHAR(255) NULL,
  backfill_message_count INT UNSIGNED NOT NULL DEFAULT 0,
  initial_backfill_completed_at DATETIME NULL,
  last_synced_at DATETIME NULL,
  last_sync_status ENUM('never','ok','error') NOT NULL DEFAULT 'never',
  last_sync_error TEXT NULL,
  connected_at DATETIME NULL,
  disabled_at DATETIME NULL,
  disabled_reason VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gmail_accounts_employee (employee_id),
  INDEX idx_gmail_accounts_sync_order (is_enabled, last_synced_at),
  CONSTRAINT fk_gmail_accounts_employee FOREIGN KEY (employee_id) REFERENCES dm_employee(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. Messages ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gmail_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  account_id INT UNSIGNED NOT NULL,
  gmail_message_id VARCHAR(64) NOT NULL,
  gmail_thread_id VARCHAR(64) NOT NULL,
  rfc_message_id VARCHAR(998) NULL COMMENT 'RFC822 Message-ID header, for reply threading',
  direction ENUM('inbound','outbound') NOT NULL,
  from_email VARCHAR(255) NULL,
  from_name VARCHAR(255) NULL,
  to_emails TEXT NULL,
  cc_emails TEXT NULL,
  subject VARCHAR(998) NULL,
  snippet VARCHAR(512) NULL,
  body_text LONGTEXT NULL,
  body_html LONGTEXT NULL,
  has_attachments TINYINT(1) NOT NULL DEFAULT 0,
  labels JSON NULL,
  is_read TINYINT(1) NULL,
  matched_lead_id INT NULL,
  message_timestamp DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gmail_msg (account_id, gmail_message_id),
  INDEX idx_gmail_msg_thread (account_id, gmail_thread_id, message_timestamp),
  INDEX idx_gmail_msg_account_ts (account_id, message_timestamp DESC),
  INDEX idx_gmail_msg_matched_lead (matched_lead_id),
  CONSTRAINT fk_gmail_msg_account FOREIGN KEY (account_id) REFERENCES dm_gmail_accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_gmail_msg_lead FOREIGN KEY (matched_lead_id) REFERENCES dmc_forum_leads(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 4. Attachments (metadata only — inbound bytes are never stored) ────────────
CREATE TABLE IF NOT EXISTS dm_gmail_attachments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id INT UNSIGNED NOT NULL,
  gmail_attachment_id VARCHAR(255) NULL COMMENT 'Gmail attachmentId, fetched on-demand for inbound',
  filename VARCHAR(255) NULL,
  mime_type VARCHAR(255) NULL,
  size_bytes INT UNSIGNED NULL,
  blob_url VARCHAR(1024) NULL COMMENT 'Populated only for outbound compose-time staged attachments',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gmail_attach (message_id, gmail_attachment_id),
  INDEX idx_gmail_attach_message (message_id),
  CONSTRAINT fk_gmail_attach_message FOREIGN KEY (message_id) REFERENCES dm_gmail_messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
