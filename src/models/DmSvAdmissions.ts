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
  public id!: number;
  public leadId!: number;
  public tab!: number;
  public doc_rec_date!: Date;
  public doc_status!: string;
  public docs_sent_through!: Date;
  public mode!: string;
  public university_name!: string;
  public program_applied!: string;
  public admission_status!: string;
  public adminssion_intake!: Date;
  public created!: Date;
  public created_by!: number;

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
