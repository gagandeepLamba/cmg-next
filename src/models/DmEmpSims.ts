import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmpSimsAttributes {
  id: number;
  branch: number;
  msisdn: number;
  sim_number: string;
  company: string;
  status: number;
  created_by: number;
  created: Date;
}

interface DmEmpSimsCreationAttributes extends Optional<DmEmpSimsAttributes, never> {}

class DmEmpSims extends Model<DmEmpSimsAttributes, DmEmpSimsCreationAttributes> implements DmEmpSimsAttributes {
  public id!: number;
  public branch!: number;
  public msisdn!: number;
  public sim_number!: string;
  public company!: string;
  public status!: number;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmEmpSims.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    msisdn: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sim_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmpSims',
    tableName: 'dm_emp_sims',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmpSims };
export type { DmEmpSimsAttributes, DmEmpSimsCreationAttributes };
