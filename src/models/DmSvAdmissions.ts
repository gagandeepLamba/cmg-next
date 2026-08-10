import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmSvAdmissionsAttributes {
  id: number;
  leadId: number;
  tab: number;
  doc_rec_date: Date;
  doc_status: string;
  docs_sent_through: Date;
  mode: string;
  university_name: string;
  program_applied: string;
  admission_status: string;
  adminssion_intake: Date;
  created: Date;
  created_by: number;
}

interface DmSvAdmissionsCreationAttributes extends Optional<DmSvAdmissionsAttributes, never> {}

class DmSvAdmissions extends Model<DmSvAdmissionsAttributes, DmSvAdmissionsCreationAttributes> implements DmSvAdmissionsAttributes {
  declare id: number;
  declare leadId: number;
  declare tab: number;
  declare doc_rec_date: Date;
  declare doc_status: string;
  declare docs_sent_through: Date;
  declare mode: string;
  declare university_name: string;
  declare program_applied: string;
  declare admission_status: string;
  declare adminssion_intake: Date;
  declare created: Date;
  declare created_by: number;

  public static associate(models: any) {
  }
}

DmSvAdmissions.init(
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
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doc_rec_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    doc_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    docs_sent_through: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mode: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    university_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    program_applied: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    admission_status: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    adminssion_intake: {
      type: DataTypes.DATE,
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
    modelName: 'DmSvAdmissions',
    tableName: 'dm_sv_admissions',
    timestamps: false,
    freezeTableName: true,
  });

export { DmSvAdmissions };
export type { DmSvAdmissionsAttributes, DmSvAdmissionsCreationAttributes };
