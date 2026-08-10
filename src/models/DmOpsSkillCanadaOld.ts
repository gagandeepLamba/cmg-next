import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillCanadaOldAttributes {
  id: number;
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
  langTest: string;
  testStatus: string;
  expiryDate: string;
  testDate: string;
  testScore: string;
  spLangTest: string;
  langFile: string;
  eeDocReceDate: string;
  eeDocSts: string;
  eePoint: string;
  eeNoc: string;
  eeSecNoc: string;
  eeProfLauDate: string;
  eeProfExpDate: string;
  eeScore: string;
  eestatus: string;
  eeFile: string;
  pnpLaun: string;
  pnpSubDate: string;
  pnpExpDate: string;
  pnpStatus: string;
  pnpFile: string;
  itaReceDate: string;
  itaSubLastDate: string;
  itaDocReceDate: string;
  itaDocSts: string;
  itaSubDate: string;
  itaSts: string;
  itaAddiReqDate: string;
  itaFile: string;
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
  rating: string;
  reading: string;
  writing: string;
  listening: string;
  speaking: string;
  statusS: string;
  expirydateS: string;
  readingS: string;
  writingS: string;
  listeningS: string;
  speakingS: string;
  testdateS: string;
  testscoreS: string;
  meetingreq: string;
  meetingreqS: string;
  comments: string;
  exp_status: string;
}

interface DmOpsSkillCanadaOldCreationAttributes extends Optional<DmOpsSkillCanadaOldAttributes, never> {}

class DmOpsSkillCanadaOld extends Model<DmOpsSkillCanadaOldAttributes, DmOpsSkillCanadaOldCreationAttributes> implements DmOpsSkillCanadaOldAttributes {
  declare id: number;
  declare retnDate: string;
  declare agreeNo: string;
  declare ecaReceDate: string;
  declare ecaPackage: string;
  declare ecaDocStatus: string;
  declare ecaAssmBody: string;
  declare ecaApplyDate: string;
  declare ecaPayMode: string;
  declare ecaTranSent: string;
  declare ecaTranStatus: string;
  declare ecaStatus: string;
  declare compDate: string;
  declare ecaFile: string;
  declare spQualify: string;
  declare specaReceDate: string;
  declare specaPackage: string;
  declare specaDocStatus: string;
  declare specaAssmBody: string;
  declare specaApplyDate: string;
  declare specaPayMode: string;
  declare specaTranSent: string;
  declare specaTranStatus: string;
  declare specaStatus: string;
  declare spcompDate: string;
  declare spEcaFile: string;
  declare langTest: string;
  declare testStatus: string;
  declare expiryDate: string;
  declare testDate: string;
  declare testScore: string;
  declare spLangTest: string;
  declare langFile: string;
  declare eeDocReceDate: string;
  declare eeDocSts: string;
  declare eePoint: string;
  declare eeNoc: string;
  declare eeSecNoc: string;
  declare eeProfLauDate: string;
  declare eeProfExpDate: string;
  declare eeScore: string;
  declare eestatus: string;
  declare eeFile: string;
  declare pnpLaun: string;
  declare pnpSubDate: string;
  declare pnpExpDate: string;
  declare pnpStatus: string;
  declare pnpFile: string;
  declare itaReceDate: string;
  declare itaSubLastDate: string;
  declare itaDocReceDate: string;
  declare itaDocSts: string;
  declare itaSubDate: string;
  declare itaSts: string;
  declare itaAddiReqDate: string;
  declare itaFile: string;
  declare visaReqDate: string;
  declare passSentDate: string;
  declare passReceDate: string;
  declare visaFile: string;
  declare landDate: string;
  declare landService: string;
  declare landFile: string;
  declare remark: string;
  declare qualification: string;
  declare specialization: string;
  declare university: string;
  declare rating: string;
  declare reading: string;
  declare writing: string;
  declare listening: string;
  declare speaking: string;
  declare statusS: string;
  declare expirydateS: string;
  declare readingS: string;
  declare writingS: string;
  declare listeningS: string;
  declare speakingS: string;
  declare testdateS: string;
  declare testscoreS: string;
  declare meetingreq: string;
  declare meetingreqS: string;
  declare comments: string;
  declare exp_status: string;

  public static associate(models: any) {
  }
}

DmOpsSkillCanadaOld.init(
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    langTest: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    testStatus: {
      type: DataTypes.STRING(50),
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    spLangTest: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    langFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eeDocReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eeDocSts: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eePoint: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    eeNoc: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    eeSecNoc: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    eeProfLauDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eeProfExpDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eeScore: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eestatus: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    eeFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pnpLaun: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pnpSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pnpExpDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pnpStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pnpFile: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    itaReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaSubLastDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaDocReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaDocSts: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    itaSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaSts: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    itaAddiReqDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaFile: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(100),
      allowNull: false
    },
    landFile: {
      type: DataTypes.STRING(100),
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
    rating: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    reading: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    writing: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    listening: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    speaking: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    statusS: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    expirydateS: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    readingS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    writingS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    listeningS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    speakingS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    testdateS: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    testscoreS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    meetingreq: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    meetingreqS: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    exp_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsSkillCanadaOld',
    tableName: 'dm_ops_skill_canada_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillCanadaOld };
export type { DmOpsSkillCanadaOldAttributes, DmOpsSkillCanadaOldCreationAttributes };
