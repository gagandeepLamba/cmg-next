import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmployerAttributes {
  id: number;
  name: string;
  email: string | null;
  mobile: string | null;
  paddress: string | null;
  vendor_id: number;
  status: number;
  website: string;
  company_name: string;
  created: Date;
  created_by: number;
}

interface DmEmployerCreationAttributes extends Optional<DmEmployerAttributes, 'email' | 'mobile' | 'paddress' | 'status'> {}

class DmEmployer extends Model<DmEmployerAttributes, DmEmployerCreationAttributes> implements DmEmployerAttributes {
  public id!: number;
  public name!: string;
  public email!: string | null;
  public mobile!: string | null;
  public paddress!: string | null;
  public vendor_id!: number;
  public status!: number;
  public website!: string;
  public company_name!: string;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmEmployer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmployer',
    tableName: 'dm_employer',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmployer };
export type { DmEmployerAttributes, DmEmployerCreationAttributes };
