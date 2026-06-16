import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillAustraliaAssessAttributes {
  id: number;
  leadId: number;
  anzCode: string;
  chklistDate: string;
  resultDate: string;
  assmAuthority: string;
  assmSubDate: string;
  assmStatus: string;
  spSkillAssm: string;
}

interface DmOpsSkillAustraliaAssessCreationAttributes extends Optional<DmOpsSkillAustraliaAssessAttributes, never> {}

class DmOpsSkillAustraliaAssess extends Model<DmOpsSkillAustraliaAssessAttributes, DmOpsSkillAustraliaAssessCreationAttributes> implements DmOpsSkillAustraliaAssessAttributes {
  public id!: number;
  public leadId!: number;
  public anzCode!: string;
  public chklistDate!: string;
  public resultDate!: string;
  public assmAuthority!: string;
  public assmSubDate!: string;
  public assmStatus!: string;
  public spSkillAssm!: string;

  public static associate(models: any) {
  }
}

DmOpsSkillAustraliaAssess.init(
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
  },
  {
    sequelize,
    modelName: 'DmOpsSkillAustraliaAssess',
    tableName: 'dm_ops_skill_australia_assess',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillAustraliaAssess };
export type { DmOpsSkillAustraliaAssessAttributes, DmOpsSkillAustraliaAssessCreationAttributes };
