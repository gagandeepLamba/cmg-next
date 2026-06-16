import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmRolePermissionAttributes {
  id: number;
  role_id: number;
  permission_id: number;
  status: number;
  created_at?: Date;
  updated_at?: Date;
}

interface DmRolePermissionCreationAttributes extends Optional<DmRolePermissionAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> {}

class DmRolePermission extends Model<DmRolePermissionAttributes, DmRolePermissionCreationAttributes> implements DmRolePermissionAttributes {
  public id!: number;
  public role_id!: number;
  public permission_id!: number;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;

  public static associate(models: any) {
    DmRolePermission.belongsTo(models.DmRole, { foreignKey: 'role_id', targetKey: 'id', as: 'role' });
    DmRolePermission.belongsTo(models.DmPermission, { foreignKey: 'permission_id', targetKey: 'id', as: 'permission' });
  }
}

DmRolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'DmRolePermission',
    tableName: 'dm_role_permissions',
    timestamps: false,
    freezeTableName: true,
  },
);

export { DmRolePermission };
export type { DmRolePermissionAttributes, DmRolePermissionCreationAttributes };
