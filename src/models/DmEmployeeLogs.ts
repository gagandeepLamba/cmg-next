import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmployeeLogsAttributes {
  id: number;
  lead_id: number;
  employee_id: number;
  log: string;
  created: Date;
  ip: string;
  browser: string;
}

interface DmEmployeeLogsCreationAttributes extends Optional<DmEmployeeLogsAttributes, never> {}

class DmEmployeeLogs extends Model<DmEmployeeLogsAttributes, DmEmployeeLogsCreationAttributes> implements DmEmployeeLogsAttributes {
  public id!: number;
  public lead_id!: number;
  public employee_id!: number;
  public log!: string;
  public created!: Date;
  public ip!: string;
  public browser!: string;

  public static associate(models: any) {
  }
}

DmEmployeeLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
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
    ip: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    browser: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmployeeLogs',
    tableName: 'dm_employee_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmployeeLogs };
export type { DmEmployeeLogsAttributes, DmEmployeeLogsCreationAttributes };
