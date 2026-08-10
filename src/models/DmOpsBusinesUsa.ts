import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsBusinesUsaAttributes {
  id: number;
  leadId: number;
  agreeNo: string;
  retnDate: string;
  escAgre: string;
  escAgreDate: string;
  passCopy: string;
  passCopyDate: string;
  escAgreCopy: string;
  escAgreCopyDate: string;
  acouDets: string;
  acouDetsDate: string;
  wireTrans: string;
  wireTransDate: string;
  profFund: string;
  profFundDate: string;
  subAgre: string;
  subAgreDate: string;
  g28: string;
  g28Date: string;
  i526: string;
  i526Date: string;
  w8Ben: string;
  w8BenDate: string;
  passPA: string;
  passSpouse: string;
  passDepnd: string;
  idPA: string;
  idSpouse: string;
  idDepnd: string;
  birthPA: string;
  birthSpouse: string;
  birthDepnd: string;
  eduPA: string;
  eduSpouse: string;
  eduDepnd: string;
  pbsPA: string;
  resmPA: string;
  nDocPA: string;
  nDocSpouse: string;
  nDocDepnd: string;
  nwrPA: string;
  nwrSpouse: string;
  nwrDepnd: string;
  pifPA: string;
  pifSpouse: string;
  pifDepnd: string;
  i526FeePA: string;
  nvcFeePA: string;
  nvcFeeSpouse: string;
  nvcFeeDepent: string;
  ds260PA: string;
  ds260Spouse: string;
  ds260Depent: string;
  ds260Sts: string;
  passCopyPA: string;
  passCopySpouse: string;
  passCopyDepent: string;
  passCopySts: string;
  birthCertPA: string;
  birthCertSpouse: string;
  birthCertDepent: string;
  birthCertSts: string;
  marCertPA: string;
  marCertSpouse: string;
  marCertDepent: string;
  marCertSts: string;
  natIdPA: string;
  natIdSpouse: string;
  natIdDepent: string;
  natIdSts: string;
  resProfPA: string;
  resProfSpouse: string;
  resProfDepent: string;
  resProfSts: string;
  pasPhotoPA: string;
  pasPhotoSpouse: string;
  pasPhotoDepent: string;
  pasPhotoSts: string;
  polCertPA: string;
  polCertSpouse: string;
  polCertDepent: string;
  polCertSts: string;
  visaReqRecDate: string;
  visaValdDate: string;
  visaInfDate: string;
  visaApptDate: string;
  visaDocRecDate: string;
  visaDocRewDate: string;
  visaDocSubDate: string;
  visaConSentDate: string;
  intwRecDate: string;
  intSchDate: string;
  intInfmDate: string;
  intFixdDate: string;
  intBrfDate: string;
  intDocDate: string;
  intDocRecDate: string;
  intPrep: string;
  intResult: string;
  waHandDate: string;
  waDocRecDate: string;
  waDocRewDate: string;
  waDocSignDate: string;
  waAppFinDate: string;
  waAppSubDate: string;
  waFormRecDate: string;
  remark: string;
  tab1File: string;
  tab2File: string;
  tab3File: string;
  tab4File: string;
  tab5File: string;
  tab6File: string;
}

interface DmOpsBusinesUsaCreationAttributes extends Optional<DmOpsBusinesUsaAttributes, never> {}

class DmOpsBusinesUsa extends Model<DmOpsBusinesUsaAttributes, DmOpsBusinesUsaCreationAttributes> implements DmOpsBusinesUsaAttributes {
  declare id: number;
  declare leadId: number;
  declare agreeNo: string;
  declare retnDate: string;
  declare escAgre: string;
  declare escAgreDate: string;
  declare passCopy: string;
  declare passCopyDate: string;
  declare escAgreCopy: string;
  declare escAgreCopyDate: string;
  declare acouDets: string;
  declare acouDetsDate: string;
  declare wireTrans: string;
  declare wireTransDate: string;
  declare profFund: string;
  declare profFundDate: string;
  declare subAgre: string;
  declare subAgreDate: string;
  declare g28: string;
  declare g28Date: string;
  declare i526: string;
  declare i526Date: string;
  declare w8Ben: string;
  declare w8BenDate: string;
  declare passPA: string;
  declare passSpouse: string;
  declare passDepnd: string;
  declare idPA: string;
  declare idSpouse: string;
  declare idDepnd: string;
  declare birthPA: string;
  declare birthSpouse: string;
  declare birthDepnd: string;
  declare eduPA: string;
  declare eduSpouse: string;
  declare eduDepnd: string;
  declare pbsPA: string;
  declare resmPA: string;
  declare nDocPA: string;
  declare nDocSpouse: string;
  declare nDocDepnd: string;
  declare nwrPA: string;
  declare nwrSpouse: string;
  declare nwrDepnd: string;
  declare pifPA: string;
  declare pifSpouse: string;
  declare pifDepnd: string;
  declare i526FeePA: string;
  declare nvcFeePA: string;
  declare nvcFeeSpouse: string;
  declare nvcFeeDepent: string;
  declare ds260PA: string;
  declare ds260Spouse: string;
  declare ds260Depent: string;
  declare ds260Sts: string;
  declare passCopyPA: string;
  declare passCopySpouse: string;
  declare passCopyDepent: string;
  declare passCopySts: string;
  declare birthCertPA: string;
  declare birthCertSpouse: string;
  declare birthCertDepent: string;
  declare birthCertSts: string;
  declare marCertPA: string;
  declare marCertSpouse: string;
  declare marCertDepent: string;
  declare marCertSts: string;
  declare natIdPA: string;
  declare natIdSpouse: string;
  declare natIdDepent: string;
  declare natIdSts: string;
  declare resProfPA: string;
  declare resProfSpouse: string;
  declare resProfDepent: string;
  declare resProfSts: string;
  declare pasPhotoPA: string;
  declare pasPhotoSpouse: string;
  declare pasPhotoDepent: string;
  declare pasPhotoSts: string;
  declare polCertPA: string;
  declare polCertSpouse: string;
  declare polCertDepent: string;
  declare polCertSts: string;
  declare visaReqRecDate: string;
  declare visaValdDate: string;
  declare visaInfDate: string;
  declare visaApptDate: string;
  declare visaDocRecDate: string;
  declare visaDocRewDate: string;
  declare visaDocSubDate: string;
  declare visaConSentDate: string;
  declare intwRecDate: string;
  declare intSchDate: string;
  declare intInfmDate: string;
  declare intFixdDate: string;
  declare intBrfDate: string;
  declare intDocDate: string;
  declare intDocRecDate: string;
  declare intPrep: string;
  declare intResult: string;
  declare waHandDate: string;
  declare waDocRecDate: string;
  declare waDocRewDate: string;
  declare waDocSignDate: string;
  declare waAppFinDate: string;
  declare waAppSubDate: string;
  declare waFormRecDate: string;
  declare remark: string;
  declare tab1File: string;
  declare tab2File: string;
  declare tab3File: string;
  declare tab4File: string;
  declare tab5File: string;
  declare tab6File: string;

  public static associate(models: any) {
  }
}

DmOpsBusinesUsa.init(
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
    agreeNo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    retnDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    escAgre: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    escAgreDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passCopy: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passCopyDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    escAgreCopy: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    escAgreCopyDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    acouDets: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    acouDetsDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    wireTrans: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    wireTransDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    profFund: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    profFundDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    subAgre: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    subAgreDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    g28: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    g28Date: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    i526: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    i526Date: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    w8Ben: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    w8BenDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    idPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    idSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    idDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eduPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eduSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eduDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbsPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    resmPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nDocPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nDocSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nDocDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nwrPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nwrSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nwrDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pifPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pifSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pifDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    i526FeePA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nvcFeePA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nvcFeeSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nvcFeeDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ds260PA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ds260Spouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ds260Depent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ds260Sts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passCopyPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passCopySpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passCopyDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passCopySts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthCertPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthCertSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthCertDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    birthCertSts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    marCertPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    marCertSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    marCertDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    marCertSts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    natIdPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    natIdSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    natIdDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    natIdSts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    resProfPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    resProfSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    resProfDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    resProfSts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pasPhotoPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pasPhotoSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pasPhotoDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pasPhotoSts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    polCertPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    polCertSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    polCertDepent: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    polCertSts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaReqRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaValdDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaInfDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaApptDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaDocRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaDocRewDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaDocSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaConSentDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intwRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intSchDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intInfmDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intFixdDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intBrfDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intDocDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intDocRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intPrep: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    intResult: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waHandDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waDocRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waDocRewDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waDocSignDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waAppFinDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waAppSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waFormRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tab1File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab2File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab3File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab4File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab5File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab6File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsBusinesUsa',
    tableName: 'dm_ops_busines_usa',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsBusinesUsa };
export type { DmOpsBusinesUsaAttributes, DmOpsBusinesUsaCreationAttributes };
