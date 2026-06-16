import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAppointmentRemarksAttributes {
  id: number;
  taskid: number | null;
  date: string;
  remarks: string | null;
  emp: string;
  notf: number;
}

interface DmAppointmentRemarksCreationAttributes extends Optional<DmAppointmentRemarksAttributes, 'taskid' | 'remarks'> {}

class DmAppointmentRemarks extends Model<DmAppointmentRemarksAttributes, DmAppointmentRemarksCreationAttributes> implements DmAppointmentRemarksAttributes {
  public id!: number;
  public taskid!: number | null;
  public date!: string;
  public remarks!: string | null;
  public emp!: string;
  public notf!: number;

  public static associate(models: any) {
  }
}

DmAppointmentRemarks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    taskid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emp: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    notf: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmAppointmentRemarks',
    tableName: 'dm_appointment_remarks',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAppointmentRemarks };
export type { DmAppointmentRemarksAttributes, DmAppointmentRemarksCreationAttributes };
