CREATE INDEX idx_dm_role_id ON dm_role(id);
CREATE INDEX idx_dm_permissions_id ON dm_permissions(id);

ALTER TABLE dm_role_permissions
  ADD CONSTRAINT fk_dm_role_permissions_role
  FOREIGN KEY (role_id) REFERENCES dm_role(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE dm_role_permissions
  ADD CONSTRAINT fk_dm_role_permissions_permission
  FOREIGN KEY (permission_id) REFERENCES dm_permissions(id)
  ON DELETE CASCADE ON UPDATE CASCADE;
