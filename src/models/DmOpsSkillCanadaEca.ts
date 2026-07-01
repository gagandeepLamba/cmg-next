import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillCanadaEcaAttributes {
  id: number;
  leadId: number;
  retnDate: string;
  agreeNo: string;
  ecaReceDate: string;
  ecaPackage: string;
  ecaDocStatus: string;
  ecaAssmBody: string;
  ecaApplyDate: string;
  ecaPayMode: string;
  ecaTranSent: string;
  ecaTranStatus: string;
  ecaStatus: string;
  compDate: string;
  ecaFile: string;
  spQualify: string;
  specaReceDate: string;
  specaPackage: string;
  specaDocStatus: string;
  specaAssmBody: string;
  specaApplyDate: string;
  specaPayMode: string;
  specaTranSent: string;
  specaTranStatus: string;
  specaStatus: string;
  spcompDate: string;
  spEcaFile: string;
  visaReqDate: string;
  passSentDate: string;
  passReceDate: string;
  visaFile: string;
  landDate: string;
  landService: string;
  landFile: string;
  remark: string;
  qualification: string;
  specialization: string;
  university: string;
  comments: string;
}

interface DmOpsSkillCanadaEcaCreationAttributes extends Optional<DmOpsSkillCanadaEcaAttributes, never> {}

class DmOpsSkillCanadaEca extends Model<DmOpsSkillCanadaEcaAttributes, DmOpsSkillCanadaEcaCreationAttributes> implements DmOpsSkillCanadaEcaAttributes {
  public id!: number;
  public leadId!: number;
  public retnDate!: string;
  public agreeNo!: string;
  public ecaReceDate!: string;
  public ecaPackage!: string;
  public ecaDocStatus!: string;
  public ecaAssmBody!: string;
  public ecaApplyDate!: string;
  public ecaPayMode!: string;
  public ecaTranSent!: string;
  public ecaTranStatus!: string;
  public ecaStatus!: string;
  public compDate!: string;
  public ecaFile!: string;
  public spQualify!: string;
  public specaReceDate!: string;
  public specaPackage!: string;
  public specaDocStatus!: string;
  public specaAssmBody!: string;
  public specaApplyDate!: string;
  public specaPayMode!: string;
  public specaTranSent!: string;
  public specaTranStatus!: string;
  public specaStatus!: string;
  public spcompDate!: string;
  public spEcaFile!: string;
  public visaReqDate!: string;
  public passSentDate!: string;
  public passReceDate!: string;
  public visaFile!: string;
  public landDate!: string;
  public landService!: string;
  public landFile!: string;
  public remark!: string;
  public qualification!: string;
  public specialization!: string;
  public university!: string;
  public comments!: string;

  public static associate(models: any) {
  }
}

DmOpsSkillCanadaEca.init(
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
    retnDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    agreeNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ecaPackage: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaDocStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaAssmBody: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaApplyDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ecaPayMode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaTranSent: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaTranStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ecaStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    compDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ecaFile: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    spQualify: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    specaPackage: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaDocStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaAssmBody: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaApplyDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    specaPayMode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaTranSent: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaTranStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    specaStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    spcompDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    spEcaFile: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    visaReqDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passSentDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    landDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    landService: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    landFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    qualification: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    specialization: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    university: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsSkillCanadaEca',
    tableName: 'dm_ops_skill_canada_eca',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillCanadaEca };
export type { DmOpsSkillCanadaEcaAttributes, DmOpsSkillCanadaEcaCreationAttributes };
