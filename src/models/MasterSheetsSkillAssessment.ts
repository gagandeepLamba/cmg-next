import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsSkillAssessmentAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsSkillAssessmentCreationAttributes extends Optional<MasterSheetsSkillAssessmentAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsSkillAssessment extends Model<MasterSheetsSkillAssessmentAttributes, MasterSheetsSkillAssessmentCreationAttributes> implements MasterSheetsSkillAssessmentAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsSkillAssessment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'MasterSheetsSkillAssessment',
    tableName: 'master_sheets_skill_assessment',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsSkillAssessment };
export type { MasterSheetsSkillAssessmentAttributes, MasterSheetsSkillAssessmentCreationAttributes };
