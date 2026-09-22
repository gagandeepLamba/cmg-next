-- Meta Lead Ads: dynamic form auto-discovery + registry.
-- Solves schema drift: when marketing launches a new form (or a new campaign
-- adds custom questions) that no mapping rule has ever seen, the pipeline no
-- longer just silently falls back to raw JSON nobody looks at — it registers
-- the form on first sight, diffs its question keys against the active
-- GLOBAL/CAMPAIGN mappings, and flags it PENDING_REVIEW so an admin can add
-- FORM-scoped mappings for the new questions. Either way no lead is ever
-- dropped: unmapped answers are always captured in
-- dm_meta_leads.unmapped_field_data alongside the full raw_lead_data.
-- MySQL 8 compatible. Safe to run more than once (CREATE TABLE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- Run: mysql -u <user> -p <database> < migrations/20260922_meta_form_registry.sql

CREATE TABLE IF NOT EXISTS dm_meta_forms (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  form_id VARCHAR(64) NOT NULL COMMENT 'Meta lead form ID',
  page_id VARCHAR(64) NULL,
  campaign_id VARCHAR(64) NULL COMMENT 'Campaign this form was first seen under',
  form_name VARCHAR(255) NULL,
  locale VARCHAR(16) NULL,
  meta_status VARCHAR(32) NULL COMMENT 'Form status reported by Meta (ACTIVE, ARCHIVED, ...)',
  questions JSON NULL COMMENT 'Raw questions array from Graph API: [{key,label,type}, ...]',
  known_field_keys JSON NULL COMMENT 'Normalized question keys extracted from questions, cached for fast diffing',
  unmapped_field_keys JSON NULL COMMENT 'Question keys with no GLOBAL/CAMPAIGN/FORM mapping at last check',
  mapping_status ENUM('ACTIVE','PENDING_REVIEW','ARCHIVED') NOT NULL DEFAULT 'PENDING_REVIEW',
  discovered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_checked_at DATETIME NULL COMMENT 'Last time questions were re-fetched from the Graph API',
  reviewed_at DATETIME NULL,
  reviewed_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_mf_form_id (form_id),
  INDEX idx_mf_status (mapping_status),
  INDEX idx_mf_campaign (campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- dm_meta_leads.unmapped_field_data (JSON fallback scoped to exactly the
-- question keys that had no mapping at processing time — belt-and-suspenders
-- alongside raw_lead_data, pre-filtered so admins reviewing a flagged lead
-- don't have to diff the full raw payload by hand) is added via
-- scripts/setup-database.js's columnMigrations + ensureColumn(), not here:
-- this server's MySQL 8.0 build rejects `ADD COLUMN IF NOT EXISTS`, and
-- ensureColumn() is this repo's actual established idempotent-column idiom
-- (see the many other dm_* columns added that same way further down that file).
