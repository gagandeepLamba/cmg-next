import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeaveTypeAttributes {
  id: number;
  name: string;
  status: number;
}

interface DmLeaveTypeCreationAttributes extends Optional<DmLeaveTypeAttributes, 'status'> {}

class DmLeaveType extends Model<DmLeaveTypeAttributes, DmLeaveTypeCreationAttributes> implements DmLeaveTypeAttributes {
  public id!: number;
  public name!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmLeaveType.init(
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
    modelName: 'DmLeaveType',
    tableName: 'dm_leave_type',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeaveType };
export type { DmLeaveTypeAttributes, DmLeaveTypeCreationAttributes };
