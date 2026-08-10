import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsBusinesPolandAttributes {
  id: number;
  leadId: number;
  agreeNo: string;
  retnDate: string;
  tvApplyDate: string;
  tvResltDate: string;
  tvApprDate: string;
  tvStatus: string;
  poVisitDate: string;
  poRtrnDate: string;
  poStatus: string;
  crRegDate: string;
  crStatus: string;
  baOpenDate: string;
  baStatus: string;
  fundTranDate: string;
  fundStatus: string;
  afPA: string;
  afSpouse: string;
  afDepend: string;
  visaReqRecDate: string;
  visaValdDate: string;
  visaInfDate: string;
  visaApptDate: string;
  visaDocRecDate: string;
  visaDocRewDate: string;
  visaDocSubDate: string;
  visaConSentDate: string;
  waHandDate: string;
  waDocRecDate: string;
  waDocRewDate: string;
  waDocSignDate: string;
  waAppFinDate: string;
  waAppSubDate: string;
  waFormRecDate: string;
  passPA: string;
  passSpouse: string;
  passDepnd: string;
  passStatus: string;
  rvPA: string;
  rvSpouse: string;
  rvDepnd: string;
  rvStatus: string;
  idPA: string;
  idSpouse: string;
  idDepnd: string;
  idStatus: string;
  bioPA: string;
  bioSpouse: string;
  bioDepnd: string;
  bioStatus: string;
  schePA: string;
  scheSpouse: string;
  scheDepnd: string;
  scheStatus: string;
  insurPA: string;
  insurSpouse: string;
  insurDepnd: string;
  insurStatus: string;
  nocPA: string;
  nocSpouse: string;
  nocDepnd: string;
  nocStatus: string;
  itinPA: string;
  itinSpouse: string;
  itinDepnd: string;
  itinStatus: string;
  purPA: string;
  purSpouse: string;
  purDepnd: string;
  purStatus: string;
  pbsPA: string;
  pbsSpouse: string;
  pbsDepnd: string;
  pbsStatus: string;
  bbsPA: string;
  bbsSpouse: string;
  bbsDepnd: string;
  bbsStatus: string;
  licePA: string;
  liceSpouse: string;
  liceDepnd: string;
  liceStatus: string;
  estaPA: string;
  estaSpouse: string;
  estaDepnd: string;
  estaStatus: string;
  partPA: string;
  partSpouse: string;
  partDepnd: string;
  partStatus: string;
  nocOtherPA: string;
  nocOtherSpouse: string;
  nocOtherDepnd: string;
  nocOtherStatus: string;
  remark: string;
  tab1File: string;
  tab2File: string;
  tab3File: string;
  tab4File: string;
  tab5File: string;
}

interface DmOpsBusinesPolandCreationAttributes extends Optional<DmOpsBusinesPolandAttributes, never> {}

class DmOpsBusinesPoland extends Model<DmOpsBusinesPolandAttributes, DmOpsBusinesPolandCreationAttributes> implements DmOpsBusinesPolandAttributes {
  declare id: number;
  declare leadId: number;
  declare agreeNo: string;
  declare retnDate: string;
  declare tvApplyDate: string;
  declare tvResltDate: string;
  declare tvApprDate: string;
  declare tvStatus: string;
  declare poVisitDate: string;
  declare poRtrnDate: string;
  declare poStatus: string;
  declare crRegDate: string;
  declare crStatus: string;
  declare baOpenDate: string;
  declare baStatus: string;
  declare fundTranDate: string;
  declare fundStatus: string;
  declare afPA: string;
  declare afSpouse: string;
  declare afDepend: string;
  declare visaReqRecDate: string;
  declare visaValdDate: string;
  declare visaInfDate: string;
  declare visaApptDate: string;
  declare visaDocRecDate: string;
  declare visaDocRewDate: string;
  declare visaDocSubDate: string;
  declare visaConSentDate: string;
  declare waHandDate: string;
  declare waDocRecDate: string;
  declare waDocRewDate: string;
  declare waDocSignDate: string;
  declare waAppFinDate: string;
  declare waAppSubDate: string;
  declare waFormRecDate: string;
  declare passPA: string;
  declare passSpouse: string;
  declare passDepnd: string;
  declare passStatus: string;
  declare rvPA: string;
  declare rvSpouse: string;
  declare rvDepnd: string;
  declare rvStatus: string;
  declare idPA: string;
  declare idSpouse: string;
  declare idDepnd: string;
  declare idStatus: string;
  declare bioPA: string;
  declare bioSpouse: string;
  declare bioDepnd: string;
  declare bioStatus: string;
  declare schePA: string;
  declare scheSpouse: string;
  declare scheDepnd: string;
  declare scheStatus: string;
  declare insurPA: string;
  declare insurSpouse: string;
  declare insurDepnd: string;
  declare insurStatus: string;
  declare nocPA: string;
  declare nocSpouse: string;
  declare nocDepnd: string;
  declare nocStatus: string;
  declare itinPA: string;
  declare itinSpouse: string;
  declare itinDepnd: string;
  declare itinStatus: string;
  declare purPA: string;
  declare purSpouse: string;
  declare purDepnd: string;
  declare purStatus: string;
  declare pbsPA: string;
  declare pbsSpouse: string;
  declare pbsDepnd: string;
  declare pbsStatus: string;
  declare bbsPA: string;
  declare bbsSpouse: string;
  declare bbsDepnd: string;
  declare bbsStatus: string;
  declare licePA: string;
  declare liceSpouse: string;
  declare liceDepnd: string;
  declare liceStatus: string;
  declare estaPA: string;
  declare estaSpouse: string;
  declare estaDepnd: string;
  declare estaStatus: string;
  declare partPA: string;
  declare partSpouse: string;
  declare partDepnd: string;
  declare partStatus: string;
  declare nocOtherPA: string;
  declare nocOtherSpouse: string;
  declare nocOtherDepnd: string;
  declare nocOtherStatus: string;
  declare remark: string;
  declare tab1File: string;
  declare tab2File: string;
  declare tab3File: string;
  declare tab4File: string;
  declare tab5File: string;

  public static associate(models: any) {
  }
}

DmOpsBusinesPoland.init(
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
    tvApplyDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tvResltDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tvApprDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tvStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    poVisitDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    poRtrnDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    poStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    crRegDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    crStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    baOpenDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    baStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    fundTranDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    fundStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    afPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    afSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    afDepend: {
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
    passStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    rvPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    rvSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    rvDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    rvStatus: {
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
    idStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bioPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bioSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bioDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bioStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    schePA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    scheSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    scheDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    scheStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    insurPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    insurSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    insurDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    insurStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itinPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itinSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itinDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itinStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    purPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    purSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    purDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    purStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbsPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbsSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbsDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbsStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bbsPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bbsSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bbsDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    bbsStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    licePA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    liceSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    liceDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    liceStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    estaPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    estaSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    estaDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    estaStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    partPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    partSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    partDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    partStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocOtherPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocOtherSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocOtherDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    nocOtherStatus: {
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
  },
  {
    sequelize,
    modelName: 'DmOpsBusinesPoland',
    tableName: 'dm_ops_busines_poland',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsBusinesPoland };
export type { DmOpsBusinesPolandAttributes, DmOpsBusinesPolandCreationAttributes };
