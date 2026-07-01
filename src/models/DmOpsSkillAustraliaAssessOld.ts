import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillAustraliaAssessOldAttributes {
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

interface DmOpsSkillAustraliaAssessOldCreationAttributes extends Optional<DmOpsSkillAustraliaAssessOldAttributes, never> {}

class DmOpsSkillAustraliaAssessOld extends Model<DmOpsSkillAustraliaAssessOldAttributes, DmOpsSkillAustraliaAssessOldCreationAttributes> implements DmOpsSkillAustraliaAssessOldAttributes {
  public id!: number;
  public agreeNo!: string;
  public anzCode!: string;
  public chklistDate!: string;
  public resultDate!: string;
  public assmAuthority!: string;
  public assmSubDate!: string;
  public assmStatus!: string;
  public spSkillAssm!: string;
  public remark!: string;
  public skilFile!: string;

  public static associate(models: any) {
  }
}

DmOpsSkillAustraliaAssessOld.init(
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
    modelName: 'DmOpsSkillAustraliaAssessOld',
    tableName: 'dm_ops_skill_australia_assess_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillAustraliaAssessOld };
export type { DmOpsSkillAustraliaAssessOldAttributes, DmOpsSkillAustraliaAssessOldCreationAttributes };
