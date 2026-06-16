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
  public id!: number;
  public leadId!: number;
  public agreeNo!: string;
  public retnDate!: string;
  public escAgre!: string;
  public escAgreDate!: string;
  public passCopy!: string;
  public passCopyDate!: string;
  public escAgreCopy!: string;
  public escAgreCopyDate!: string;
  public acouDets!: string;
  public acouDetsDate!: string;
  public wireTrans!: string;
  public wireTransDate!: string;
  public profFund!: string;
  public profFundDate!: string;
  public subAgre!: string;
  public subAgreDate!: string;
  public g28!: string;
  public g28Date!: string;
  public i526!: string;
  public i526Date!: string;
  public w8Ben!: string;
  public w8BenDate!: string;
  public passPA!: string;
  public passSpouse!: string;
  public passDepnd!: string;
  public idPA!: string;
  public idSpouse!: string;
  public idDepnd!: string;
  public birthPA!: string;
  public birthSpouse!: string;
  public birthDepnd!: string;
  public eduPA!: string;
  public eduSpouse!: string;
  public eduDepnd!: string;
  public pbsPA!: string;
  public resmPA!: string;
  public nDocPA!: string;
  public nDocSpouse!: string;
  public nDocDepnd!: string;
  public nwrPA!: string;
  public nwrSpouse!: string;
  public nwrDepnd!: string;
  public pifPA!: string;
  public pifSpouse!: string;
  public pifDepnd!: string;
  public i526FeePA!: string;
  public nvcFeePA!: string;
  public nvcFeeSpouse!: string;
  public nvcFeeDepent!: string;
  public ds260PA!: string;
  public ds260Spouse!: string;
  public ds260Depent!: string;
  public ds260Sts!: string;
  public passCopyPA!: string;
  public passCopySpouse!: string;
  public passCopyDepent!: string;
  public passCopySts!: string;
  public birthCertPA!: string;
  public birthCertSpouse!: string;
  public birthCertDepent!: string;
  public birthCertSts!: string;
  public marCertPA!: string;
  public marCertSpouse!: string;
  public marCertDepent!: string;
  public marCertSts!: string;
  public natIdPA!: string;
  public natIdSpouse!: string;
  public natIdDepent!: string;
  public natIdSts!: string;
  public resProfPA!: string;
  public resProfSpouse!: string;
  public resProfDepent!: string;
  public resProfSts!: string;
  public pasPhotoPA!: string;
  public pasPhotoSpouse!: string;
  public pasPhotoDepent!: string;
  public pasPhotoSts!: string;
  public polCertPA!: string;
  public polCertSpouse!: string;
  public polCertDepent!: string;
  public polCertSts!: string;
  public visaReqRecDate!: string;
  public visaValdDate!: string;
  public visaInfDate!: string;
  public visaApptDate!: string;
  public visaDocRecDate!: string;
  public visaDocRewDate!: string;
  public visaDocSubDate!: string;
  public visaConSentDate!: string;
  public intwRecDate!: string;
  public intSchDate!: string;
  public intInfmDate!: string;
  public intFixdDate!: string;
  public intBrfDate!: string;
  public intDocDate!: string;
  public intDocRecDate!: string;
  public intPrep!: string;
  public intResult!: string;
  public waHandDate!: string;
  public waDocRecDate!: string;
  public waDocRewDate!: string;
  public waDocSignDate!: string;
  public waAppFinDate!: string;
  public waAppSubDate!: string;
  public waFormRecDate!: string;
  public remark!: string;
  public tab1File!: string;
  public tab2File!: string;
  public tab3File!: string;
  public tab4File!: string;
  public tab5File!: string;
  public tab6File!: string;

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
