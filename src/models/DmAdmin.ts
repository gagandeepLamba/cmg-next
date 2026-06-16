import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAdminAttributes {
  id: number;
  user: string;
  pwd: string;
  status: number;
}

interface DmAdminCreationAttributes extends Optional<DmAdminAttributes, 'status'> {}

class DmAdmin extends Model<DmAdminAttributes, DmAdminCreationAttributes> implements DmAdminAttributes {
  public id!: number;
  public user!: string;
  public pwd!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmAdmin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  {
    sequelize,
    modelName: 'DmAdmin',
    tableName: 'dm_admin',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAdmin };
export type { DmAdminAttributes, DmAdminCreationAttributes };
