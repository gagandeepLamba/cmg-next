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
  public id!: number;
  public leadid!: number | null;
  public date!: string | null;
  public type!: string | null;
  public conversation!: string | null;
  public emp!: number;
  public automated!: number;
  public created!: Date;
  public followup!: Date;
  public status!: number;
  public followup_remarks!: string;
  public conversation_status!: string;
  public status_date!: Date;

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
