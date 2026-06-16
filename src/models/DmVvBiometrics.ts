import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmVvBiometricsAttributes {
  id: number;
  leadId: number;
  bio_name: string;
  bio_age: string;
  biometrics_submission: string;
  country: number;
  no_of_applicant: number;
  bio_status: string;
  biometrics_appointment_date: Date;
  status: number;
  created_by: number;
  created: Date;
}

interface DmVvBiometricsCreationAttributes extends Optional<DmVvBiometricsAttributes, never> {}

class DmVvBiometrics extends Model<DmVvBiometricsAttributes, DmVvBiometricsCreationAttributes> implements DmVvBiometricsAttributes {
  public id!: number;
  public leadId!: number;
  public bio_name!: string;
  public bio_age!: string;
  public biometrics_submission!: string;
  public country!: number;
  public no_of_applicant!: number;
  public bio_status!: string;
  public biometrics_appointment_date!: Date;
  public status!: number;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmVvBiometrics.init(
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
    bio_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bio_age: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    biometrics_submission: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_of_applicant: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bio_status: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    biometrics_appointment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmVvBiometrics',
    tableName: 'dm_vv_biometrics',
    timestamps: false,
    freezeTableName: true,
  });

export { DmVvBiometrics };
export type { DmVvBiometricsAttributes, DmVvBiometricsCreationAttributes };
