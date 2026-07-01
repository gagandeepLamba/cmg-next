import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsConversationOldAttributes {
  id: number;
  agreeNo: string | null;
  date: Date | null;
  type: string | null;
  conversation: string | null;
  emp: number | null;
  followup: Date;
  status: number;
  status_date: Date;
}

interface DmOpsConversationOldCreationAttributes extends Optional<DmOpsConversationOldAttributes, 'agreeNo' | 'date' | 'type' | 'conversation' | 'emp'> {}

class DmOpsConversationOld extends Model<DmOpsConversationOldAttributes, DmOpsConversationOldCreationAttributes> implements DmOpsConversationOldAttributes {
  public id!: number;
  public agreeNo!: string | null;
  public date!: Date | null;
  public type!: string | null;
  public conversation!: string | null;
  public emp!: number | null;
  public followup!: Date;
  public status!: number;
  public status_date!: Date;

  public static associate(models: any) {
  }
}

DmOpsConversationOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    conversation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    followup: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsConversationOld',
    tableName: 'dm_ops_conversation_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsConversationOld };
export type { DmOpsConversationOldAttributes, DmOpsConversationOldCreationAttributes };
