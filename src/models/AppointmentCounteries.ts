import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AppointmentCounteriesAttributes {
  id: number;
  country_name: string;
  created: Date;
  created_by: number;
  status: number;
}

interface AppointmentCounteriesCreationAttributes extends Optional<AppointmentCounteriesAttributes, never> {}

class AppointmentCounteries extends Model<AppointmentCounteriesAttributes, AppointmentCounteriesCreationAttributes> implements AppointmentCounteriesAttributes {
  public id!: number;
  public country_name!: string;
  public created!: Date;
  public created_by!: number;
  public status!: number;

  public static associate(models: any) {
  }
}

AppointmentCounteries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'AppointmentCounteries',
    tableName: 'appointment_counteries',
    timestamps: false,
    freezeTableName: true,
  });

export { AppointmentCounteries };
export type { AppointmentCounteriesAttributes, AppointmentCounteriesCreationAttributes };
