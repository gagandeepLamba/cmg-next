-- Bank-transfer payment details ("PAYMENT DETAILS (for bank transfer)" block
-- on the tax invoice/receipt) previously had nowhere to live — receipts only
-- ever showed the branch's TRN/licence, never bank account info. Add an
-- explicit, admin-editable set of columns per branch, matched by `abbrv`
-- like license_number/vat_gst_percent (see 20260711_add_branch_license_vat_gst.sql).
-- Dubai (CMG) is seeded with placeholder/dummy values only — real banking
-- details should be entered by finance through the branch admin screen, not
-- committed to source control.
ALTER TABLE dm_branch
  ADD COLUMN bank_name VARCHAR(150) NULL,
  ADD COLUMN bank_account_name VARCHAR(150) NULL,
  ADD COLUMN bank_account_number VARCHAR(50) NULL,
  ADD COLUMN bank_iban VARCHAR(50) NULL,
  ADD COLUMN bank_branch VARCHAR(150) NULL;

UPDATE dm_branch
SET bank_name = 'Sample Bank (PLACEHOLDER)',
    bank_account_name = 'Company Account Name (PLACEHOLDER)',
    bank_account_number = '0000000000',
    bank_iban = 'AE00 0000 0000 0000 0000 000',
    bank_branch = 'Dubai, UAE'
WHERE abbrv = 'DXB SZR';
