import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OpsLogsAttributes {
  id: number;
  lead: number | null;
  ag_no: number | null;
  emp: number | null;
  timestamp: string | null;
}

interface OpsLogsCreationAttributes extends Optional<OpsLogsAttributes, 'lead' | 'ag_no' | 'emp' | 'timestamp'> {}

class OpsLogs extends Model<OpsLogsAttributes, OpsLogsCreationAttributes> implements OpsLogsAttributes {
  public id!: number;
  public lead!: number | null;
  public ag_no!: number | null;
  public emp!: number | null;
  public timestamp!: string | null;

  public static associate(models: any) {
  }
}

OpsLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ag_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    emp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'OpsLogs',
    tableName: 'ops_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { OpsLogs };
export type { OpsLogsAttributes, OpsLogsCreationAttributes };
