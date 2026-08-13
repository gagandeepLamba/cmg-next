-- appointments.screenshot was overloaded for both the booking note text and
-- the meeting-proof upload URL — marking a meeting done overwrote whatever
-- note was booked with it. Give notes their own column so booking notes
-- survive the meeting being marked done and can be reloaded correctly in the
-- view/detail UI.
ALTER TABLE appointments
  ADD COLUMN notes TEXT NULL AFTER foe_remark;
