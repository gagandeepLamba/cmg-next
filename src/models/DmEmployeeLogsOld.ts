import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmployeeLogsOldAttributes {
  id: number;
  agreeNo: number;
  employee_id: number;
  log: string;
  created: Date;
}

interface DmEmployeeLogsOldCreationAttributes extends Optional<DmEmployeeLogsOldAttributes, never> {}

class DmEmployeeLogsOld extends Model<DmEmployeeLogsOldAttributes, DmEmployeeLogsOldCreationAttributes> implements DmEmployeeLogsOldAttributes {
  public id!: number;
  public agreeNo!: number;
  public employee_id!: number;
  public log!: string;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmEmployeeLogsOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    log: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmployeeLogsOld',
    tableName: 'dm_employee_logs_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmployeeLogsOld };
export type { DmEmployeeLogsOldAttributes, DmEmployeeLogsOldCreationAttributes };
