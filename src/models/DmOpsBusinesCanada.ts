import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsBusinesCanadaAttributes {
  id: number;
  leadId: number;
  agreeNo: string;
  retnDate: string;
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
  expVisit: string;
  expAgent: string;
  expCounty: string;
  expSdate: string;
  expEdate: string;
  ndPA: string;
  ndSpouse: string;
  ndDepend: string;
  pgPA: string;
  pgSpouse: string;
  pgDepend: string;
  piPA: string;
  piSpouse: string;
  piDepend: string;
  eiReceDate: string;
  eiRewDate: string;
  eiFinDate: string;
  eiSentDate: string;
  eiConfDate: string;
  eiSubDate: string;
  eiInvtDate: string;
  eiValdDate: string;
  visaPaySts: string;
  visaPayDate: string;
  docGivDate: string;
  docRecDate: string;
  docStatus: string;
  docRewDate: string;
  docFowDate: string;
  docFeeDate: string;
  docRepDate: string;
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
  paReceDate: string;
  paAgreDate: string;
  paSentDate: string;
  paConfDate: string;
  waRecDate: string;
  waInfDate: string;
  waFixDate: string;
  waHandDate: string;
  waDocRecDate: string;
  waDocRewDate: string;
  waDocSignDate: string;
  waAppFinDate: string;
  waAppSubDate: string;
  waAppSentDate: string;
  waFileRecDate: string;
  waReqRecDate: string;
  waMedRecDate: string;
  waMedSubDate: string;
  waPapRecDate: string;
  remark: string;
  tab1File: string;
  tab2File: string;
  tab3File: string;
  tab4File: string;
  tab5File: string;
  tab6File: string;
  tab7File: string;
  tab8File: string;
  tab9File: string;
  tab10File: string;
}

interface DmOpsBusinesCanadaCreationAttributes extends Optional<DmOpsBusinesCanadaAttributes, never> {}

class DmOpsBusinesCanada extends Model<DmOpsBusinesCanadaAttributes, DmOpsBusinesCanadaCreationAttributes> implements DmOpsBusinesCanadaAttributes {
  public id!: number;
  public leadId!: number;
  public agreeNo!: string;
  public retnDate!: string;
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
  public expVisit!: string;
  public expAgent!: string;
  public expCounty!: string;
  public expSdate!: string;
  public expEdate!: string;
  public ndPA!: string;
  public ndSpouse!: string;
  public ndDepend!: string;
  public pgPA!: string;
  public pgSpouse!: string;
  public pgDepend!: string;
  public piPA!: string;
  public piSpouse!: string;
  public piDepend!: string;
  public eiReceDate!: string;
  public eiRewDate!: string;
  public eiFinDate!: string;
  public eiSentDate!: string;
  public eiConfDate!: string;
  public eiSubDate!: string;
  public eiInvtDate!: string;
  public eiValdDate!: string;
  public visaPaySts!: string;
  public visaPayDate!: string;
  public docGivDate!: string;
  public docRecDate!: string;
  public docStatus!: string;
  public docRewDate!: string;
  public docFowDate!: string;
  public docFeeDate!: string;
  public docRepDate!: string;
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
  public paReceDate!: string;
  public paAgreDate!: string;
  public paSentDate!: string;
  public paConfDate!: string;
  public waRecDate!: string;
  public waInfDate!: string;
  public waFixDate!: string;
  public waHandDate!: string;
  public waDocRecDate!: string;
  public waDocRewDate!: string;
  public waDocSignDate!: string;
  public waAppFinDate!: string;
  public waAppSubDate!: string;
  public waAppSentDate!: string;
  public waFileRecDate!: string;
  public waReqRecDate!: string;
  public waMedRecDate!: string;
  public waMedSubDate!: string;
  public waPapRecDate!: string;
  public remark!: string;
  public tab1File!: string;
  public tab2File!: string;
  public tab3File!: string;
  public tab4File!: string;
  public tab5File!: string;
  public tab6File!: string;
  public tab7File!: string;
  public tab8File!: string;
  public tab9File!: string;
  public tab10File!: string;

  public static associate(models: any) {
  }
}

DmOpsBusinesCanada.init(
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
    expVisit: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expAgent: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expCounty: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expSdate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    expEdate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ndPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ndSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    ndDepend: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pgPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pgSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pgDepend: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    piPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    piSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    piDepend: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiRewDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiFinDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiSentDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiConfDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiInvtDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eiValdDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaPaySts: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaPayDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docGivDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docRewDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docFowDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docFeeDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    docRepDate: {
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
    paReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    paAgreDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    paSentDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    paConfDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waInfDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waFixDate: {
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
    waAppSentDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waFileRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waReqRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waMedRecDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waMedSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    waPapRecDate: {
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
    tab7File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab8File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab9File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tab10File: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsBusinesCanada',
    tableName: 'dm_ops_busines_canada',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsBusinesCanada };
export type { DmOpsBusinesCanadaAttributes, DmOpsBusinesCanadaCreationAttributes };
