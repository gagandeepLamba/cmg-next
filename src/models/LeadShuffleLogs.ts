import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface LeadShuffleLogsAttributes {
  id: number;
  leadid: number | null;
  date: string | null;
  transfrom: number | null;
  transto: number | null;
}

interface LeadShuffleLogsCreationAttributes extends Optional<LeadShuffleLogsAttributes, 'leadid' | 'date' | 'transfrom' | 'transto'> {}

class LeadShuffleLogs extends Model<LeadShuffleLogsAttributes, LeadShuffleLogsCreationAttributes> implements LeadShuffleLogsAttributes {
  public id!: number;
  public leadid!: number | null;
  public date!: string | null;
  public transfrom!: number | null;
  public transto!: number | null;

  public static associate(models: any) {
  }
}

LeadShuffleLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    transfrom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'LeadShuffleLogs',
    tableName: 'lead_shuffle_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { LeadShuffleLogs };
export type { LeadShuffleLogsAttributes, LeadShuffleLogsCreationAttributes };
