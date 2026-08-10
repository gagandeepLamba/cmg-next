import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientConversationsAttributes {
  id: number;
  leadId: number;
  opportunityId: number | null;
  case_manager: number;
  chat_from_client: number;
  client_id: number;
  text: string;
  file: string;
  status: number;
  read_msg: number;
  created: Date;
}

interface DmClientConversationsCreationAttributes extends Optional<DmClientConversationsAttributes, 'id' | 'created' | 'opportunityId'> {}

class DmClientConversations extends Model<DmClientConversationsAttributes, DmClientConversationsCreationAttributes> implements DmClientConversationsAttributes {
  declare id: number;
  declare leadId: number;
  declare opportunityId: number | null;
  declare case_manager: number;
  declare chat_from_client: number;
  declare client_id: number;
  declare text: string;
  declare file: string;
  declare status: number;
  declare read_msg: number;
  declare created: Date;

  public static associate(models: any) {
    DmClientConversations.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmClientConversations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'opportunity_id',
    },
    case_manager: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chat_from_client: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    file: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    read_msg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    modelName: 'DmClientConversations',
    tableName: 'dm_client_conversations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmClientConversations };
export type { DmClientConversationsAttributes, DmClientConversationsCreationAttributes };
