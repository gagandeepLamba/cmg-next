import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmPolBiometricsAttributes {
  id: number;
  leadId: number;
  country: number;
  bio_status: string;
  biometrics_appointment_date: Date;
  status: number;
  created_by: number;
  created: Date;
}

interface DmPolBiometricsCreationAttributes extends Optional<DmPolBiometricsAttributes, never> {}

class DmPolBiometrics extends Model<DmPolBiometricsAttributes, DmPolBiometricsCreationAttributes> implements DmPolBiometricsAttributes {
  declare id: number;
  declare leadId: number;
  declare country: number;
  declare bio_status: string;
  declare biometrics_appointment_date: Date;
  declare status: number;
  declare created_by: number;
  declare created: Date;

  public static associate(models: any) {
  }
}

DmPolBiometrics.init(
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
    country: {
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
    modelName: 'DmPolBiometrics',
    tableName: 'dm_pol_biometrics',
    timestamps: false,
    freezeTableName: true,
  });

export { DmPolBiometrics };
export type { DmPolBiometricsAttributes, DmPolBiometricsCreationAttributes };
