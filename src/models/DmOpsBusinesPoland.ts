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
  public id!: number;
  public leadId!: number;
  public agreeNo!: string;
  public retnDate!: string;
  public tvApplyDate!: string;
  public tvResltDate!: string;
  public tvApprDate!: string;
  public tvStatus!: string;
  public poVisitDate!: string;
  public poRtrnDate!: string;
  public poStatus!: string;
  public crRegDate!: string;
  public crStatus!: string;
  public baOpenDate!: string;
  public baStatus!: string;
  public fundTranDate!: string;
  public fundStatus!: string;
  public afPA!: string;
  public afSpouse!: string;
  public afDepend!: string;
  public visaReqRecDate!: string;
  public visaValdDate!: string;
  public visaInfDate!: string;
  public visaApptDate!: string;
  public visaDocRecDate!: string;
  public visaDocRewDate!: string;
  public visaDocSubDate!: string;
  public visaConSentDate!: string;
  public waHandDate!: string;
  public waDocRecDate!: string;
  public waDocRewDate!: string;
  public waDocSignDate!: string;
  public waAppFinDate!: string;
  public waAppSubDate!: string;
  public waFormRecDate!: string;
  public passPA!: string;
  public passSpouse!: string;
  public passDepnd!: string;
  public passStatus!: string;
  public rvPA!: string;
  public rvSpouse!: string;
  public rvDepnd!: string;
  public rvStatus!: string;
  public idPA!: string;
  public idSpouse!: string;
  public idDepnd!: string;
  public idStatus!: string;
  public bioPA!: string;
  public bioSpouse!: string;
  public bioDepnd!: string;
  public bioStatus!: string;
  public schePA!: string;
  public scheSpouse!: string;
  public scheDepnd!: string;
  public scheStatus!: string;
  public insurPA!: string;
  public insurSpouse!: string;
  public insurDepnd!: string;
  public insurStatus!: string;
  public nocPA!: string;
  public nocSpouse!: string;
  public nocDepnd!: string;
  public nocStatus!: string;
  public itinPA!: string;
  public itinSpouse!: string;
  public itinDepnd!: string;
  public itinStatus!: string;
  public purPA!: string;
  public purSpouse!: string;
  public purDepnd!: string;
  public purStatus!: string;
  public pbsPA!: string;
  public pbsSpouse!: string;
  public pbsDepnd!: string;
  public pbsStatus!: string;
  public bbsPA!: string;
  public bbsSpouse!: string;
  public bbsDepnd!: string;
  public bbsStatus!: string;
  public licePA!: string;
  public liceSpouse!: string;
  public liceDepnd!: string;
  public liceStatus!: string;
  public estaPA!: string;
  public estaSpouse!: string;
  public estaDepnd!: string;
  public estaStatus!: string;
  public partPA!: string;
  public partSpouse!: string;
  public partDepnd!: string;
  public partStatus!: string;
  public nocOtherPA!: string;
  public nocOtherSpouse!: string;
  public nocOtherDepnd!: string;
  public nocOtherStatus!: string;
  public remark!: string;
  public tab1File!: string;
  public tab2File!: string;
  public tab3File!: string;
  public tab4File!: string;
  public tab5File!: string;

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
