import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientLogsAttributes {
  id: number;
  client_id: number;
  lead_id: number;
  title: string;
  log: string;
  created: Date;
}

interface DmClientLogsCreationAttributes extends Optional<DmClientLogsAttributes, never> {}

class DmClientLogs extends Model<DmClientLogsAttributes, DmClientLogsCreationAttributes> implements DmClientLogsAttributes {
  public id!: number;
  public client_id!: number;
  public lead_id!: number;
  public title!: string;
  public log!: string;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmClientLogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
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
    modelName: 'DmClientLogs',
    tableName: 'dm_client_logs',
    timestamps: false,
    freezeTableName: true,
  });

export { DmClientLogs };
export type { DmClientLogsAttributes, DmClientLogsCreationAttributes };
