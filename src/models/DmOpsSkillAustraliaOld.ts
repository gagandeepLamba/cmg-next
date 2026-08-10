import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillAustraliaOldAttributes {
  id: number;
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

interface DmOpsSkillAustraliaOldCreationAttributes extends Optional<DmOpsSkillAustraliaOldAttributes, never> {}

class DmOpsSkillAustraliaOld extends Model<DmOpsSkillAustraliaOldAttributes, DmOpsSkillAustraliaOldCreationAttributes> implements DmOpsSkillAustraliaOldAttributes {
  declare id: number;
  declare retnDate: string;
  declare agreeNo: string;
  declare langTest: string;
  declare testStatus: string;
  declare expiryDate: string;
  declare testDate: string;
  declare testScore: string;
  declare reading: number;
  declare writing: number;
  declare listening: number;
  declare speaking: number;
  declare spLangTest: string;
  declare anzCode: string;
  declare chklistDate: string;
  declare resultDate: string;
  declare assmAuthority: string;
  declare assmSubDate: string;
  declare assmStatus: string;
  declare spSkillAssm: string;
  declare eoiLodgDate: string;
  declare eoiExpDate: string;
  declare eoiPoint: string;
  declare eoiStatus: string;
  declare eoiFund: string;
  declare eoiState: string;
  declare nomState: string;
  declare nomSubDate: string;
  declare nomExpDate: string;
  declare itaDate: string;
  declare itaExpDate: string;
  declare visaSubDate: string;
  declare medExam: string;
  declare policeClear: string;
  declare visaStatus: string;
  declare landDate: string;
  declare landService: string;
  declare remark: string;
  declare langFile: string;
  declare skilFile: string;
  declare eoiFile: string;
  declare nomFile: string;
  declare visaFile: string;
  declare landFile: string;
  declare langTests: string;
  declare testStatuss: string;
  declare expiryDates: string;
  declare testDates: string;
  declare testScores: string;
  declare readings: number;
  declare writings: number;
  declare listenings: number;
  declare speakings: number;
  declare langFiles: string;

  public static associate(models: any) {
  }
}

DmOpsSkillAustraliaOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    modelName: 'DmOpsSkillAustraliaOld',
    tableName: 'dm_ops_skill_australia_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillAustraliaOld };
export type { DmOpsSkillAustraliaOldAttributes, DmOpsSkillAustraliaOldCreationAttributes };
