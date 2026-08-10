import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillAustraliaAssessSpouseOldAttributes {
  id: number;
  agreeNo: string;
  anzCode: string;
  chklistDate: string;
  resultDate: string;
  assmAuthority: string;
  assmSubDate: string;
  assmStatus: string;
  spSkillAssm: string;
  remark: string;
  skilFile: string;
}

interface DmOpsSkillAustraliaAssessSpouseOldCreationAttributes extends Optional<DmOpsSkillAustraliaAssessSpouseOldAttributes, never> {}

class DmOpsSkillAustraliaAssessSpouseOld extends Model<DmOpsSkillAustraliaAssessSpouseOldAttributes, DmOpsSkillAustraliaAssessSpouseOldCreationAttributes> implements DmOpsSkillAustraliaAssessSpouseOldAttributes {
  declare id: number;
  declare agreeNo: string;
  declare anzCode: string;
  declare chklistDate: string;
  declare resultDate: string;
  declare assmAuthority: string;
  declare assmSubDate: string;
  declare assmStatus: string;
  declare spSkillAssm: string;
  declare remark: string;
  declare skilFile: string;

  public static associate(models: any) {
  }
}

DmOpsSkillAustraliaAssessSpouseOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    anzCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    chklistDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    resultDate: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    assmAuthority: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    assmSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    assmStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    spSkillAssm: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    skilFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsSkillAustraliaAssessSpouseOld',
    tableName: 'dm_ops_skill_australia_assess_spouse_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillAustraliaAssessSpouseOld };
export type { DmOpsSkillAustraliaAssessSpouseOldAttributes, DmOpsSkillAustraliaAssessSpouseOldCreationAttributes };
