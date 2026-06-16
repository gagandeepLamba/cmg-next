import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EscalationLogsAttributes {
  id: number;
  lead: number | null;
  emp: number | null;
  date: string | null;
}

interface EscalationLogsCreationAttributes extends Optional<EscalationLogsAttributes, 'lead' | 'emp' | 'date'> {}

class EscalationLogs extends Model<EscalationLogsAttributes, EscalationLogsCreationAttributes> implements EscalationLogsAttributes {
  public id!: number;
  public lead!: number | null;
  public emp!: number | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

EscalationLogs.init(
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
    emp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'EscalationLogs',
    tableName: 'escalation_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { EscalationLogs };
export type { EscalationLogsAttributes, EscalationLogsCreationAttributes };
