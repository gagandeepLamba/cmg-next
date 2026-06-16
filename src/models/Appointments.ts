import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AppointmentsAttributes {
  id: number;
  leadid: number | null;
  date: string | null;
  appointtime: string;
  counsilorid: number | null;
  booked: number | null;
  done: number | null;
  not_done: number | null;
  region: number | null;
  branch: number;
  screenshot: string;
  second_done: number;
  second_meet_date: string | null;
}

interface AppointmentsCreationAttributes extends Optional<AppointmentsAttributes, 'id' | 'leadid' | 'date' | 'counsilorid' | 'booked' | 'done' | 'not_done' | 'region' | 'branch' | 'screenshot' | 'second_done' | 'second_meet_date'> {}

class Appointments extends Model<AppointmentsAttributes, AppointmentsCreationAttributes> implements AppointmentsAttributes {
  public id!: number;
  public leadid!: number | null;
  public date!: string | null;
  public appointtime!: string;
  public counsilorid!: number | null;
  public booked!: number | null;
  public done!: number | null;
  public not_done!: number | null;
  public region!: number | null;
  public branch!: number;
  public screenshot!: string;
  public second_done!: number;
  public second_meet_date!: string | null;

  public static associate(models: any) {
    Appointments.belongsTo(models.DmcForumLeads, { foreignKey: 'leadid', targetKey: 'id', as: 'lead' });
    Appointments.belongsTo(models.DmEmployee, { foreignKey: 'counsilorid', targetKey: 'id', as: 'counselor' });
    Appointments.belongsTo(models.DmBranch, { foreignKey: 'branch', targetKey: 'id', as: 'branchInfo' });
    Appointments.belongsTo(models.DmRegion, { foreignKey: 'region', targetKey: 'id', as: 'regionInfo' });
  }
}

Appointments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    appointtime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    counsilorid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    booked: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    done: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    not_done: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    screenshot: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    second_done: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    second_meet_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
  },
  {
    sequelize,
    modelName: 'Appointments',
    tableName: 'appointments',
    timestamps: false,
    freezeTableName: true,
  });

export { Appointments };
export type { AppointmentsAttributes, AppointmentsCreationAttributes };
