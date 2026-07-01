import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsStudentVisaAttributes {
  id: number;
  leadId: number;
  retnDate: string;
  agreeNo: string;
  docSubDate: string;
  planTravDate: string;
  descountry: string;
  university: string;
  docReceDate: string;
  appSub: string;
  appStatus: string;
  remark1: string;
  docFile: string;
  appFile: string;
  remark2: string | null;
}

interface DmOpsStudentVisaCreationAttributes extends Optional<DmOpsStudentVisaAttributes, 'remark2'> {}

class DmOpsStudentVisa extends Model<DmOpsStudentVisaAttributes, DmOpsStudentVisaCreationAttributes> implements DmOpsStudentVisaAttributes {
  public id!: number;
  public leadId!: number;
  public retnDate!: string;
  public agreeNo!: string;
  public docSubDate!: string;
  public planTravDate!: string;
  public descountry!: string;
  public university!: string;
  public docReceDate!: string;
  public appSub!: string;
  public appStatus!: string;
  public remark1!: string;
  public docFile!: string;
  public appFile!: string;
  public remark2!: string | null;

  public static associate(models: any) {
  }
}

DmOpsStudentVisa.init(
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
    docSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    planTravDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    descountry: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    university: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    docReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    appSub: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    appStatus: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    remark1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    docFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    appFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remark2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmOpsStudentVisa',
    tableName: 'dm_ops_student_visa',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsStudentVisa };
export type { DmOpsStudentVisaAttributes, DmOpsStudentVisaCreationAttributes };
