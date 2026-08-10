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
  declare id: number;
  declare emp_id: number;
  declare ip_address: string;
  declare device: string;
  declare agent: string;
  declare login_time: Date;
  declare logout_time: Date;
  declare total_hours: number;
  declare short_fall: number;
  declare remarks: string;
  declare watch_by: number;
  declare created: Date;
  declare created_by: number;
  declare checkin: number;
  declare checkout: number;
  declare logout_ip_address: string;
  declare extra_hours: number;

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
