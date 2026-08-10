import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEipRnipAttributes {
  id: number;
  leadId: string;
  tab: number;
  community: string;
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

interface DmEipRnipCreationAttributes extends Optional<DmEipRnipAttributes, never> {}

class DmEipRnip extends Model<DmEipRnipAttributes, DmEipRnipCreationAttributes> implements DmEipRnipAttributes {
  declare id: number;
  declare leadId: string;
  declare tab: number;
  declare community: string;
  declare noc: string;
  declare registration_date: Date;
  declare doc_rec_date: Date;
  declare doc_status: string;
  declare employer_name: string;
  declare job_applied_date: Date;
  declare job_status: string;
  declare interview_received: string;
  declare interview_date: Date;
  declare interview_status: string;

  public static associate(models: any) {
  }
}

DmEipRnip.init(
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
    community: {
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
    modelName: 'DmEipRnip',
    tableName: 'dm_eip_rnip',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEipRnip };
export type { DmEipRnipAttributes, DmEipRnipCreationAttributes };
