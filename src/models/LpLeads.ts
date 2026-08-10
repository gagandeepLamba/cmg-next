import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface LpLeadsAttributes {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  program: string;
  lp: string;
  ip_address: string;
  status: number;
  created: Date;
  emp_id: number;
  lead_id: number;
  lead_remark: string;
  branch: number;
  education: string;
  age: string;
}

interface LpLeadsCreationAttributes extends Optional<LpLeadsAttributes, never> {}

class LpLeads extends Model<LpLeadsAttributes, LpLeadsCreationAttributes> implements LpLeadsAttributes {
  declare id: number;
  declare name: string;
  declare phone: string;
  declare email: string;
  declare location: string;
  declare program: string;
  declare lp: string;
  declare ip_address: string;
  declare status: number;
  declare created: Date;
  declare emp_id: number;
  declare lead_id: number;
  declare lead_remark: string;
  declare branch: number;
  declare education: string;
  declare age: string;

  public static associate(models: any) {
  }
}

LpLeads.init(
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
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    program: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lp: {
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
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    education: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    age: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'LpLeads',
    tableName: 'lp_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { LpLeads };
export type { LpLeadsAttributes, LpLeadsCreationAttributes };
