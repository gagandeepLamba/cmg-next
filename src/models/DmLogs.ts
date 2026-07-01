import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLogsAttributes {
  id: number;
  date_time: Date;
  action: string | null;
  message: string | null;
  source: string | null;
  done_by: number;
}

interface DmLogsCreationAttributes extends Optional<DmLogsAttributes, 'date_time' | 'action' | 'message' | 'source'> {}

class DmLogs extends Model<DmLogsAttributes, DmLogsCreationAttributes> implements DmLogsAttributes {
  public id!: number;
  public date_time!: Date;
  public action!: string | null;
  public message!: string | null;
  public source!: string | null;
  public done_by!: number;

  public static associate(models: any) {
  }
}

DmLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'date/time'
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    done_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'done by'
    },
  },
  {
    sequelize,
    modelName: 'DmLogs',
    tableName: 'dm_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLogs };
export type { DmLogsAttributes, DmLogsCreationAttributes };
