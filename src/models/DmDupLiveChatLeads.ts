import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmDupLiveChatLeadsAttributes {
  id: number;
  name: string;
  branch: number;
  phone: string;
  program: string;
  businesstype: string;
  location: string;
  email: string;
  ip_address: string;
  status: number;
  created: Date;
  emp_id: number;
  lead_id: number;
  lead_remark: string;
}

interface DmDupLiveChatLeadsCreationAttributes extends Optional<DmDupLiveChatLeadsAttributes, never> {}

class DmDupLiveChatLeads extends Model<DmDupLiveChatLeadsAttributes, DmDupLiveChatLeadsCreationAttributes> implements DmDupLiveChatLeadsAttributes {
  public id!: number;
  public name!: string;
  public branch!: number;
  public phone!: string;
  public program!: string;
  public businesstype!: string;
  public location!: string;
  public email!: string;
  public ip_address!: string;
  public status!: number;
  public created!: Date;
  public emp_id!: number;
  public lead_id!: number;
  public lead_remark!: string;

  public static associate(models: any) {
  }
}

DmDupLiveChatLeads.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    program: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    businesstype: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lead_remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmDupLiveChatLeads',
    tableName: 'dm_dup_live_chat_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmDupLiveChatLeads };
export type { DmDupLiveChatLeadsAttributes, DmDupLiveChatLeadsCreationAttributes };
