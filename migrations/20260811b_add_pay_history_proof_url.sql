-- dm_pay_history has declared a `proof_url` column in the Sequelize model
-- (src/models/DmPayHistory.ts) and the lead-to-opportunity flow's raw INSERT
-- (src/app/api/lead-to-opportunity/route.ts) has written to it since that
-- flow was built, but no migration ever added the column to the live table
-- ("first commit" seeded the model ahead of the schema). This left every
-- payment-recording INSERT failing with "Unknown column 'proof_url' in
-- 'field list'" whenever a proof-of-payment URL was attached.
ALTER TABLE dm_pay_history
  ADD COLUMN proof_url VARCHAR(500) NULL;
