-- Google Search Console + Tag Manager Integration Schema
-- MySQL 8 compatible. Safe to run more than once (CREATE TABLE IF NOT EXISTS).
-- Run: mysql -u <user> -p <database> < migrations/20260904_google_console_integration.sql

-- ── 1. Integration Settings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_google_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  is_enabled TINYINT(1) NOT NULL DEFAULT 0,
  site_url VARCHAR(512) NULL COMMENT 'GSC property, exact registered form (sc-domain:... or https://...)',
  gtm_account_id VARCHAR(64) NULL,
  gtm_container_id VARCHAR(64) NULL,
  gtm_container_public_id VARCHAR(32) NULL COMMENT 'The GTM-XXXXXXX string used in the site snippet',
  last_gsc_sync_at DATETIME NULL,
  last_gtm_sync_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert a default settings row so there is always exactly one row
INSERT IGNORE INTO dm_google_settings (id, is_enabled) VALUES (1, 0);

-- ── 2. Search Performance (Search Analytics API) ───────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gsc_search_performance (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_date DATE NOT NULL,
  query TEXT NULL,
  query_hash CHAR(64) NOT NULL DEFAULT '' COMMENT 'SHA-256 of query (or empty-string hash when query is NULL) for dedup',
  page_url TEXT NULL,
  page_hash CHAR(64) NOT NULL DEFAULT '' COMMENT 'SHA-256 of page_url (or empty-string hash when NULL) for dedup',
  device VARCHAR(32) NOT NULL DEFAULT '',
  country VARCHAR(16) NOT NULL DEFAULT '',
  clicks INT UNSIGNED NOT NULL DEFAULT 0,
  impressions INT UNSIGNED NOT NULL DEFAULT 0,
  ctr DECIMAL(7,4) NOT NULL DEFAULT 0,
  position DECIMAL(7,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gsp_row (report_date, query_hash, page_hash, device, country),
  INDEX idx_gsp_date (report_date),
  INDEX idx_gsp_clicks (clicks)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 3. Tracked Pages (CEO-curated list for URL Inspection) ─────────────────────
CREATE TABLE IF NOT EXISTS dm_gsc_tracked_pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_url VARCHAR(1024) NOT NULL,
  label VARCHAR(255) NULL,
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gtp_url (page_url(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 4. Coverage / Indexing Status (URL Inspection API) ──────────────────────────
CREATE TABLE IF NOT EXISTS dm_gsc_coverage (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_url VARCHAR(1024) NOT NULL,
  index_status VARCHAR(64) NULL,
  coverage_state VARCHAR(255) NULL,
  last_crawl_time DATETIME NULL,
  checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  raw_data JSON NULL,
  UNIQUE KEY uq_gc_url (page_url(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 5. Sitemaps ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gsc_sitemaps (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sitemap_path VARCHAR(1024) NOT NULL,
  is_pending TINYINT(1) NOT NULL DEFAULT 0,
  is_sitemaps_index TINYINT(1) NOT NULL DEFAULT 0,
  last_submitted DATETIME NULL,
  last_downloaded DATETIME NULL,
  warnings INT UNSIGNED NOT NULL DEFAULT 0,
  errors INT UNSIGNED NOT NULL DEFAULT 0,
  submitted_url_count INT UNSIGNED NOT NULL DEFAULT 0,
  checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gsm_path (sitemap_path(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 6. GTM Tags Cache ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gtm_tags_cache (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tag_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NULL,
  type VARCHAR(128) NULL,
  status VARCHAR(32) NULL COMMENT 'e.g. live, paused',
  firing_trigger_ids JSON NULL,
  last_synced_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gtm_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 7. GTM Triggers Cache ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gtm_triggers_cache (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  trigger_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NULL,
  type VARCHAR(128) NULL,
  last_synced_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gtm_trigger (trigger_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 8. GTM Version / Publish History ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dm_gtm_version_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  version_id VARCHAR(64) NOT NULL,
  version_name VARCHAR(255) NULL,
  notes TEXT NULL,
  published_at DATETIME NULL,
  raw_data JSON NULL,
  last_synced_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_gtm_version (version_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
