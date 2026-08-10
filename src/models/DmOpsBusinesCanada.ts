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
  declare id: number;
  declare leadId: number;
  declare agreeNo: string;
  declare retnDate: string;
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
  declare expVisit: string;
  declare expAgent: string;
  declare expCounty: string;
  declare expSdate: string;
  declare expEdate: string;
  declare ndPA: string;
  declare ndSpouse: string;
  declare ndDepend: string;
  declare pgPA: string;
  declare pgSpouse: string;
  declare pgDepend: string;
  declare piPA: string;
  declare piSpouse: string;
  declare piDepend: string;
  declare eiReceDate: string;
  declare eiRewDate: string;
  declare eiFinDate: string;
  declare eiSentDate: string;
  declare eiConfDate: string;
  declare eiSubDate: string;
  declare eiInvtDate: string;
  declare eiValdDate: string;
  declare visaPaySts: string;
  declare visaPayDate: string;
  declare docGivDate: string;
  declare docRecDate: string;
  declare docStatus: string;
  declare docRewDate: string;
  declare docFowDate: string;
  declare docFeeDate: string;
  declare docRepDate: string;
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
  declare paReceDate: string;
  declare paAgreDate: string;
  declare paSentDate: string;
  declare paConfDate: string;
  declare waRecDate: string;
  declare waInfDate: string;
  declare waFixDate: string;
  declare waHandDate: string;
  declare waDocRecDate: string;
  declare waDocRewDate: string;
  declare waDocSignDate: string;
  declare waAppFinDate: string;
  declare waAppSubDate: string;
  declare waAppSentDate: string;
  declare waFileRecDate: string;
  declare waReqRecDate: string;
  declare waMedRecDate: string;
  declare waMedSubDate: string;
  declare waPapRecDate: string;
  declare remark: string;
  declare tab1File: string;
  declare tab2File: string;
  declare tab3File: string;
  declare tab4File: string;
  declare tab5File: string;
  declare tab6File: string;
  declare tab7File: string;
  declare tab8File: string;
  declare tab9File: string;
  declare tab10File: string;

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
