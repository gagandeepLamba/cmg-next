import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsBusinesUkAttributes {
  id: number;
  leadId: number;
  agreeNo: string;
  retnDate: string;
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
  pbsSpouse: string;
  pbsDepnd: string;
  pbcPA: string;
  pbcSpouse: string;
  pbcDepnd: string;
  tplPA: string;
  tplSpouse: string;
  tplDepnd: string;
  tpbPA: string;
  tpbSpouse: string;
  tpbDepnd: string;
  tpsPA: string;
  tpsSpouse: string;
  tpsDepnd: string;
  tpbsPA: string;
  tpbsSpouse: string;
  tpbsDepnd: string;
  tpbcPA: string;
  tpbcSpouse: string;
  tpbcDepnd: string;
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
}

interface DmOpsBusinesUkCreationAttributes extends Optional<DmOpsBusinesUkAttributes, never> {}

class DmOpsBusinesUk extends Model<DmOpsBusinesUkAttributes, DmOpsBusinesUkCreationAttributes> implements DmOpsBusinesUkAttributes {
  public id!: number;
  public leadId!: number;
  public agreeNo!: string;
  public retnDate!: string;
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
  public pbsSpouse!: string;
  public pbsDepnd!: string;
  public pbcPA!: string;
  public pbcSpouse!: string;
  public pbcDepnd!: string;
  public tplPA!: string;
  public tplSpouse!: string;
  public tplDepnd!: string;
  public tpbPA!: string;
  public tpbSpouse!: string;
  public tpbDepnd!: string;
  public tpsPA!: string;
  public tpsSpouse!: string;
  public tpsDepnd!: string;
  public tpbsPA!: string;
  public tpbsSpouse!: string;
  public tpbsDepnd!: string;
  public tpbcPA!: string;
  public tpbcSpouse!: string;
  public tpbcDepnd!: string;
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

  public static associate(models: any) {
  }
}

DmOpsBusinesUk.init(
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
    pbsSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbsDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbcPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbcSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    pbcDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tplPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tplSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tplDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpsPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpsSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpsDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbsPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbsSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbsDepnd: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbcPA: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbcSpouse: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    tpbcDepnd: {
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
  },
  {
    sequelize,
    modelName: 'DmOpsBusinesUk',
    tableName: 'dm_ops_busines_uk',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsBusinesUk };
export type { DmOpsBusinesUkAttributes, DmOpsBusinesUkCreationAttributes };
