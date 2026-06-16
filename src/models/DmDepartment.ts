import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmDepartmentAttributes {
  id: number;
  name: string;
  status: number;
}

interface DmDepartmentCreationAttributes extends Optional<DmDepartmentAttributes, 'status'> {}

class DmDepartment extends Model<DmDepartmentAttributes, DmDepartmentCreationAttributes> implements DmDepartmentAttributes {
  public id!: number;
  public name!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmDepartment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
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
    modelName: 'DmDepartment',
    tableName: 'dm_department',
    timestamps: false,
    freezeTableName: true,
  });

export { DmDepartment };
export type { DmDepartmentAttributes, DmDepartmentCreationAttributes };
