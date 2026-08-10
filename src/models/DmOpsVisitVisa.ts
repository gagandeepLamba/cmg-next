import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsVisitVisaAttributes {
  id: number;
  leadId: number;
  retnDate: string | null;
  agreeNo: string | null;
  docSubDate: string | null;
  planTravDate: string | null;
  descountry: string | null;
  university: string | null;
  docReceDate: string | null;
  appSub: string | null;
  appStatus: string | null;
  remark1: string | null;
  docFile: string | null;
  appFile: string | null;
  remark2: string | null;
  remark_by: number;
}

interface DmOpsVisitVisaCreationAttributes extends Optional<DmOpsVisitVisaAttributes, 'retnDate' | 'agreeNo' | 'docSubDate' | 'planTravDate' | 'descountry' | 'university' | 'docReceDate' | 'appSub' | 'appStatus' | 'remark1' | 'docFile' | 'appFile' | 'remark2'> {}

class DmOpsVisitVisa extends Model<DmOpsVisitVisaAttributes, DmOpsVisitVisaCreationAttributes> implements DmOpsVisitVisaAttributes {
  declare id: number;
  declare leadId: number;
  declare retnDate: string | null;
  declare agreeNo: string | null;
  declare docSubDate: string | null;
  declare planTravDate: string | null;
  declare descountry: string | null;
  declare university: string | null;
  declare docReceDate: string | null;
  declare appSub: string | null;
  declare appStatus: string | null;
  declare remark1: string | null;
  declare docFile: string | null;
  declare appFile: string | null;
  declare remark2: string | null;
  declare remark_by: number;

  public static associate(models: any) {
  }
}

DmOpsVisitVisa.init(
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
      allowNull: true
    },
    agreeNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    docSubDate: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    planTravDate: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    descountry: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    university: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    docReceDate: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    appSub: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    appStatus: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    remark1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    docFile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    appFile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsVisitVisa',
    tableName: 'dm_ops_visit_visa',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsVisitVisa };
export type { DmOpsVisitVisaAttributes, DmOpsVisitVisaCreationAttributes };
