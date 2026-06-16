import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmRoleAttributes {
  id: number;
  name: string;
  hierarchy: number;
  status: number;
  type: string;
  department_id: number;
}

interface DmRoleCreationAttributes extends Optional<DmRoleAttributes, 'status'> {}

class DmRole extends Model<DmRoleAttributes, DmRoleCreationAttributes> implements DmRoleAttributes {
  public id!: number;
  public name!: string;
  public hierarchy!: number;
  public status!: number;
  public type!: string;
  public department_id!: number;

  public static associate(models: any) {
    DmRole.hasMany(models.DmEmployee, { foreignKey: 'role', sourceKey: 'id', as: 'dmEmployees' });
    DmRole.hasMany(models.DmRolePermission, { foreignKey: 'role_id', sourceKey: 'id', as: 'rolePermissions' });
    DmRole.belongsToMany(models.DmPermission, {
      through: models.DmRolePermission,
      foreignKey: 'role_id',
      otherKey: 'permission_id',
      as: 'permissions',
    });
  }
}

DmRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    hierarchy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    type: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmRole',
    tableName: 'dm_role',
    timestamps: false,
    freezeTableName: true,
  });

export { DmRole };
export type { DmRoleAttributes, DmRoleCreationAttributes };
