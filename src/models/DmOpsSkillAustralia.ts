import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillAustraliaAttributes {
  id: number;
  leadId: number;
  retnDate: string;
  agreeNo: string;
  langTest: string;
  testStatus: string;
  expiryDate: string;
  testDate: string;
  testScore: string;
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  spLangTest: string;
  anzCode: string;
  chklistDate: string;
  resultDate: string;
  assmAuthority: string;
  assmSubDate: string;
  assmStatus: string;
  spSkillAssm: string;
  eoiLodgDate: string;
  eoiExpDate: string;
  eoiPoint: string;
  eoiStatus: string;
  eoiFund: string;
  eoiState: string;
  nomState: string;
  nomSubDate: string;
  nomExpDate: string;
  itaDate: string;
  itaExpDate: string;
  visaSubDate: string;
  medExam: string;
  policeClear: string;
  visaStatus: string;
  landDate: string;
  landService: string;
  remark: string;
  langFile: string;
  skilFile: string;
  eoiFile: string;
  nomFile: string;
  visaFile: string;
  landFile: string;
  langTests: string;
  testStatuss: string;
  expiryDates: string;
  testDates: string;
  testScores: string;
  readings: number;
  writings: number;
  listenings: number;
  speakings: number;
  langFiles: string;
}

interface DmOpsSkillAustraliaCreationAttributes extends Optional<DmOpsSkillAustraliaAttributes, never> {}

class DmOpsSkillAustralia extends Model<DmOpsSkillAustraliaAttributes, DmOpsSkillAustraliaCreationAttributes> implements DmOpsSkillAustraliaAttributes {
  public id!: number;
  public leadId!: number;
  public retnDate!: string;
  public agreeNo!: string;
  public langTest!: string;
  public testStatus!: string;
  public expiryDate!: string;
  public testDate!: string;
  public testScore!: string;
  public reading!: number;
  public writing!: number;
  public listening!: number;
  public speaking!: number;
  public spLangTest!: string;
  public anzCode!: string;
  public chklistDate!: string;
  public resultDate!: string;
  public assmAuthority!: string;
  public assmSubDate!: string;
  public assmStatus!: string;
  public spSkillAssm!: string;
  public eoiLodgDate!: string;
  public eoiExpDate!: string;
  public eoiPoint!: string;
  public eoiStatus!: string;
  public eoiFund!: string;
  public eoiState!: string;
  public nomState!: string;
  public nomSubDate!: string;
  public nomExpDate!: string;
  public itaDate!: string;
  public itaExpDate!: string;
  public visaSubDate!: string;
  public medExam!: string;
  public policeClear!: string;
  public visaStatus!: string;
  public landDate!: string;
  public landService!: string;
  public remark!: string;
  public langFile!: string;
  public skilFile!: string;
  public eoiFile!: string;
  public nomFile!: string;
  public visaFile!: string;
  public landFile!: string;
  public langTests!: string;
  public testStatuss!: string;
  public expiryDates!: string;
  public testDates!: string;
  public testScores!: string;
  public readings!: number;
  public writings!: number;
  public listenings!: number;
  public speakings!: number;
  public langFiles!: string;

  public static associate(models: any) {
  }
}

DmOpsSkillAustralia.init(
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
    langTest: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    testStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    testDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    testScore: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    reading: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    writing: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    listening: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    speaking: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    spLangTest: {
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
    eoiLodgDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eoiExpDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eoiPoint: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eoiStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eoiFund: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eoiState: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    nomState: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    nomSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nomExpDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaExpDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    medExam: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    policeClear: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    visaStatus: {
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
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    langFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    skilFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eoiFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nomFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    visaFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    landFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    langTests: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    testStatuss: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    expiryDates: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    testDates: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    testScores: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    readings: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    writings: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    listenings: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    speakings: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    langFiles: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsSkillAustralia',
    tableName: 'dm_ops_skill_australia',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillAustralia };
export type { DmOpsSkillAustraliaAttributes, DmOpsSkillAustraliaCreationAttributes };
