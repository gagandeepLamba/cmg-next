import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientConversationsAttributes {
  id: number;
  leadId: number;
  case_manager: number;
  chat_from_client: number;
  client_id: number;
  text: string;
  file: string;
  status: number;
  read_msg: number;
  created: Date;
}

interface DmClientConversationsCreationAttributes extends Optional<DmClientConversationsAttributes, 'created'> {}

class DmClientConversations extends Model<DmClientConversationsAttributes, DmClientConversationsCreationAttributes> implements DmClientConversationsAttributes {
  public id!: number;
  public leadId!: number;
  public case_manager!: number;
  public chat_from_client!: number;
  public client_id!: number;
  public text!: string;
  public file!: string;
  public status!: number;
  public read_msg!: number;
  public created!: Date;

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
