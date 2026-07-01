import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmDupLpLeadsAttributes {
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

interface DmDupLpLeadsCreationAttributes extends Optional<DmDupLpLeadsAttributes, never> {}

class DmDupLpLeads extends Model<DmDupLpLeadsAttributes, DmDupLpLeadsCreationAttributes> implements DmDupLpLeadsAttributes {
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

DmDupLpLeads.init(
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
    modelName: 'DmDupLpLeads',
    tableName: 'dm_dup_lp_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmDupLpLeads };
export type { DmDupLpLeadsAttributes, DmDupLpLeadsCreationAttributes };
