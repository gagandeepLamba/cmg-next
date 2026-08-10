import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJsResumeWritingAttributes {
  id: number;
  lead_id: number;
  resume_date: Date;
  resume_draft: string;
  upload_passport: string;
  education: string;
  education_document: string;
  national_id: string;
  created: Date;
  created_by: number;
  level_one_remarks: string;
  level_two_remarks: string;
  final_copy_resume: string;
  tab: number;
}

interface DmJsResumeWritingCreationAttributes extends Optional<DmJsResumeWritingAttributes, never> {}

class DmJsResumeWriting extends Model<DmJsResumeWritingAttributes, DmJsResumeWritingCreationAttributes> implements DmJsResumeWritingAttributes {
  declare id: number;
  declare lead_id: number;
  declare resume_date: Date;
  declare resume_draft: string;
  declare upload_passport: string;
  declare education: string;
  declare education_document: string;
  declare national_id: string;
  declare created: Date;
  declare created_by: number;
  declare level_one_remarks: string;
  declare level_two_remarks: string;
  declare final_copy_resume: string;
  declare tab: number;

  public static associate(models: any) {
  }
}

DmJsResumeWriting.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    resume_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    resume_draft: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upload_passport: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    education: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    education_document: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    national_id: {
      type: DataTypes.STRING(255),
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
    level_one_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    level_two_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    final_copy_resume: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmJsResumeWriting',
    tableName: 'dm_js_resume_writing',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJsResumeWriting };
export type { DmJsResumeWritingAttributes, DmJsResumeWritingCreationAttributes };
