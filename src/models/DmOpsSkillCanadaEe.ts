import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillCanadaEeAttributes {
  id: number;
  leadId: number;
  retnDate: string;
  agreeNo: string;
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
}

interface DmOpsSkillCanadaEeCreationAttributes extends Optional<DmOpsSkillCanadaEeAttributes, never> {}

class DmOpsSkillCanadaEe extends Model<DmOpsSkillCanadaEeAttributes, DmOpsSkillCanadaEeCreationAttributes> implements DmOpsSkillCanadaEeAttributes {
  public id!: number;
  public leadId!: number;
  public retnDate!: string;
  public agreeNo!: string;
  public eeDocReceDate!: string;
  public eeDocSts!: string;
  public eePoint!: string;
  public eeNoc!: string;
  public eeSecNoc!: string;
  public eeProfLauDate!: string;
  public eeProfExpDate!: string;
  public eeScore!: string;
  public eestatus!: string;
  public eeFile!: string;
  public pnpLaun!: string;
  public pnpSubDate!: string;
  public pnpExpDate!: string;
  public pnpStatus!: string;
  public pnpFile!: string;

  public static associate(models: any) {
  }
}

DmOpsSkillCanadaEe.init(
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
    eeDocReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    eeDocSts: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eePoint: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eeNoc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    eeSecNoc: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsSkillCanadaEe',
    tableName: 'dm_ops_skill_canada_ee',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillCanadaEe };
export type { DmOpsSkillCanadaEeAttributes, DmOpsSkillCanadaEeCreationAttributes };
