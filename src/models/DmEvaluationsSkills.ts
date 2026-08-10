import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEvaluationsSkillsAttributes {
  id: number;
  client_id: number;
  skill_age_remarks: string;
  skill_age_marks: number;
  level_of_edu_remarks: string;
  level_of_edu_marks: number;
  first_level_prof_remarks: string;
  first_level_prof_marks: number;
  second_level_prof_remarks: string;
  second_level_prof_marks: number;
  canadian_work_exp_remarks: string;
  canadian_work_exp_marks: number;
  level_of_edu_acc_remarks: string;
  level_of_edu_acc_marks: number;
  canadian_work_exp_acc_remarks: string;
  canadian_work_exp_acc_marks: number;
  offcial_lang_prof_remarks: string;
  offcial_lang_prof_marks: number;
  level_of_edu_lang_abl_remarks: string;
  level_of_edu_lang_abl_marks: number;
  foreign_work_exp_remarks: string;
  foreign_work_exp_marks: number;
  created: Date;
  created_by: number;
}

interface DmEvaluationsSkillsCreationAttributes extends Optional<DmEvaluationsSkillsAttributes, never> {}

class DmEvaluationsSkills extends Model<DmEvaluationsSkillsAttributes, DmEvaluationsSkillsCreationAttributes> implements DmEvaluationsSkillsAttributes {
  declare id: number;
  declare client_id: number;
  declare skill_age_remarks: string;
  declare skill_age_marks: number;
  declare level_of_edu_remarks: string;
  declare level_of_edu_marks: number;
  declare first_level_prof_remarks: string;
  declare first_level_prof_marks: number;
  declare second_level_prof_remarks: string;
  declare second_level_prof_marks: number;
  declare canadian_work_exp_remarks: string;
  declare canadian_work_exp_marks: number;
  declare level_of_edu_acc_remarks: string;
  declare level_of_edu_acc_marks: number;
  declare canadian_work_exp_acc_remarks: string;
  declare canadian_work_exp_acc_marks: number;
  declare offcial_lang_prof_remarks: string;
  declare offcial_lang_prof_marks: number;
  declare level_of_edu_lang_abl_remarks: string;
  declare level_of_edu_lang_abl_marks: number;
  declare foreign_work_exp_remarks: string;
  declare foreign_work_exp_marks: number;
  declare created: Date;
  declare created_by: number;

  public static associate(models: any) {
  }
}

DmEvaluationsSkills.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    skill_age_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    skill_age_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level_of_edu_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    level_of_edu_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_level_prof_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    first_level_prof_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    second_level_prof_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    second_level_prof_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    canadian_work_exp_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    canadian_work_exp_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level_of_edu_acc_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    level_of_edu_acc_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    canadian_work_exp_acc_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    canadian_work_exp_acc_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    offcial_lang_prof_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    offcial_lang_prof_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level_of_edu_lang_abl_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    level_of_edu_lang_abl_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    foreign_work_exp_remarks: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    foreign_work_exp_marks: {
      type: DataTypes.INTEGER,
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
    modelName: 'DmEvaluationsSkills',
    tableName: 'dm_evaluations_skills',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEvaluationsSkills };
export type { DmEvaluationsSkillsAttributes, DmEvaluationsSkillsCreationAttributes };
