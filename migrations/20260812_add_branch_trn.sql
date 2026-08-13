-- The Tax Invoice/Receipt requires the company's FTA Tax Registration Number
-- (TRN) as its own field — previously the receipt template reused
-- license_number for this, but a trade licence number and an FTA TRN are two
-- different registrations and the invoice must show the real one. Nullable:
-- until finance enters the real TRN, the receipt shows the same "mandatory —
-- insert FTA Tax Registration Number" placeholder the paper template does,
-- rather than fabricating a number.
ALTER TABLE dm_branch
  ADD COLUMN trn VARCHAR(30) NULL AFTER license_number;
