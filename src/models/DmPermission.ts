import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmPermissionAttributes {
  id: number;
  permission_key: string;
  module: string;
  action: string;
  label: string;
  description?: string | null;
  status: number;
  created_at?: Date;
  updated_at?: Date;
}

interface DmPermissionCreationAttributes extends Optional<DmPermissionAttributes, 'id' | 'description' | 'status' | 'created_at' | 'updated_at'> {}

class DmPermission extends Model<DmPermissionAttributes, DmPermissionCreationAttributes> implements DmPermissionAttributes {
  public id!: number;
  public permission_key!: string;
  public module!: string;
  public action!: string;
  public label!: string;
  public description!: string | null;
  public status!: number;
  public created_at!: Date;
  public updated_at!: Date;

  public static associate(models: any) {
    DmPermission.hasMany(models.DmRolePermission, { foreignKey: 'permission_id', sourceKey: 'id', as: 'rolePermissions' });
    DmPermission.belongsToMany(models.DmRole, {
      through: models.DmRolePermission,
      foreignKey: 'permission_id',
      otherKey: 'role_id',
      as: 'roles',
    });
  }
}

DmPermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    permission_key: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    module: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'DmPermission',
    tableName: 'dm_permissions',
    timestamps: false,
    freezeTableName: true,
  },
);

export { DmPermission };
export type { DmPermissionAttributes, DmPermissionCreationAttributes };
