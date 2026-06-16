import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface LeadLogsAttributes {
  id: number;
  date_time: Date | null;
  leadid: number | null;
  ACTION: string | null;
}

interface LeadLogsCreationAttributes extends Optional<LeadLogsAttributes, 'date_time' | 'leadid' | 'ACTION'> {}

class LeadLogs extends Model<LeadLogsAttributes, LeadLogsCreationAttributes> implements LeadLogsAttributes {
  public id!: number;
  public date_time!: Date | null;
  public leadid!: number | null;
  public ACTION!: string | null;

  public static associate(models: any) {
  }
}

LeadLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP(6)',
      field: 'date/time'
    },
    leadid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ACTION: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'LeadLogs',
    tableName: 'lead_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { LeadLogs };
export type { LeadLogsAttributes, LeadLogsCreationAttributes };
