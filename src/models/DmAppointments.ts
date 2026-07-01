import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAppointmentsAttributes {
  id: number;
  task: string;
  asignBy: number;
  status: string;
  created: Date;
  doc: Date;
  notf: number;
}

interface DmAppointmentsCreationAttributes extends Optional<DmAppointmentsAttributes, 'status'> {}

class DmAppointments extends Model<DmAppointmentsAttributes, DmAppointmentsCreationAttributes> implements DmAppointmentsAttributes {
  public id!: number;
  public task!: string;
  public asignBy!: number;
  public status!: string;
  public created!: Date;
  public doc!: Date;
  public notf!: number;

  public static associate(models: any) {
  }
}

DmAppointments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    task: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    asignBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '0'
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    doc: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notf: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmAppointments',
    tableName: 'dm_appointments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAppointments };
export type { DmAppointmentsAttributes, DmAppointmentsCreationAttributes };
