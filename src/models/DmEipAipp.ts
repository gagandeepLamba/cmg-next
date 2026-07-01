import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEipAippAttributes {
  id: number;
  leadId: string;
  tab: number;
  province: string;
  noc: string;
  registration_date: Date;
  doc_rec_date: Date;
  doc_status: string;
  employer_name: string;
  job_applied_date: Date;
  job_status: string;
  interview_received: string;
  interview_date: Date;
  interview_status: string;
}

interface DmEipAippCreationAttributes extends Optional<DmEipAippAttributes, never> {}

class DmEipAipp extends Model<DmEipAippAttributes, DmEipAippCreationAttributes> implements DmEipAippAttributes {
  public id!: number;
  public leadId!: string;
  public tab!: number;
  public province!: string;
  public noc!: string;
  public registration_date!: Date;
  public doc_rec_date!: Date;
  public doc_status!: string;
  public employer_name!: string;
  public job_applied_date!: Date;
  public job_status!: string;
  public interview_received!: string;
  public interview_date!: Date;
  public interview_status!: string;

  public static associate(models: any) {
  }
}

DmEipAipp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    noc: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    doc_rec_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    doc_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    employer_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    job_applied_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    job_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    interview_received: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    interview_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    interview_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEipAipp',
    tableName: 'dm_eip_aipp',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEipAipp };
export type { DmEipAippAttributes, DmEipAippCreationAttributes };
