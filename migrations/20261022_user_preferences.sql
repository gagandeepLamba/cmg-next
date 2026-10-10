-- Per-employee UI preferences (e.g. which columns each counselor wants to see
-- in a list). One row per employee per preference key; the value is a small
-- JSON document validated by the API. Safe to re-run.

CREATE TABLE IF NOT EXISTS crm_user_preferences (
  employee_id INT NOT NULL,
  pref_key VARCHAR(80) NOT NULL,
  pref_value TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (employee_id, pref_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
