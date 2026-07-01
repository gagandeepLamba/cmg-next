import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmployeeAttendanceAttributes {
  id: number;
  emp_id: number;
  ip_address: string;
  device: string;
  agent: string;
  login_time: Date;
  logout_time: Date;
  total_hours: number;
  short_fall: number;
  remarks: string;
  watch_by: number;
  created: Date;
  created_by: number;
  checkin: number;
  checkout: number;
  logout_ip_address: string;
  extra_hours: number;
}

interface DmEmployeeAttendanceCreationAttributes extends Optional<DmEmployeeAttendanceAttributes, never> {}

class DmEmployeeAttendance extends Model<DmEmployeeAttendanceAttributes, DmEmployeeAttendanceCreationAttributes> implements DmEmployeeAttendanceAttributes {
  public id!: number;
  public emp_id!: number;
  public ip_address!: string;
  public device!: string;
  public agent!: string;
  public login_time!: Date;
  public logout_time!: Date;
  public total_hours!: number;
  public short_fall!: number;
  public remarks!: string;
  public watch_by!: number;
  public created!: Date;
  public created_by!: number;
  public checkin!: number;
  public checkout!: number;
  public logout_ip_address!: string;
  public extra_hours!: number;

  public static associate(models: any) {
  }
}

DmEmployeeAttendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    device: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    agent: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    login_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    logout_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    total_hours: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    short_fall: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    watch_by: {
      type: DataTypes.INTEGER,
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
    checkin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    checkout: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    logout_ip_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    extra_hours: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmployeeAttendance',
    tableName: 'dm_employee_attendance',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmployeeAttendance };
export type { DmEmployeeAttendanceAttributes, DmEmployeeAttendanceCreationAttributes };
