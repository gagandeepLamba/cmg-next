import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsConversationAttributes {
  id: number;
  leadid: number | null;
  date: string | null;
  type: string | null;
  conversation: string | null;
  emp: number;
  automated: number;
  created: Date;
  followup: Date;
  status: number;
  followup_remarks: string;
  conversation_status: string;
  status_date: Date;
}

interface DmOpsConversationCreationAttributes extends Optional<DmOpsConversationAttributes, 'leadid' | 'date' | 'type' | 'conversation' | 'emp' | 'automated' | 'created'> {}

class DmOpsConversation extends Model<DmOpsConversationAttributes, DmOpsConversationCreationAttributes> implements DmOpsConversationAttributes {
  declare id: number;
  declare leadid: number | null;
  declare date: string | null;
  declare type: string | null;
  declare conversation: string | null;
  declare emp: number;
  declare automated: number;
  declare created: Date;
  declare followup: Date;
  declare status: number;
  declare followup_remarks: string;
  declare conversation_status: string;
  declare status_date: Date;

  public static associate(models: any) {
  }
}

DmOpsConversation.init(
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
      type: DataTypes.STRING(30),
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
      allowNull: false,
      defaultValue: 0
    },
    automated: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    followup: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followup_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    conversation_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsConversation',
    tableName: 'dm_ops_conversation',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsConversation };
export type { DmOpsConversationAttributes, DmOpsConversationCreationAttributes };
