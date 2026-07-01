import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeaveHistoryAttributes {
  id: number;
  custId: number;
  applyDate: Date;
  fromDate: Date;
  toDate: Date;
  type: string;
  approvBy: string;
  requestedTo: string;
  requested_time_from: Date;
  requested_time_to: Date;
  remark: string;
  status: number;
  file: string;
  reject: string;
  reject_remarks: string;
  notf: number;
  approved_date: Date;
  reject_date: Date;
}

interface DmLeaveHistoryCreationAttributes extends Optional<DmLeaveHistoryAttributes, 'status'> {}

class DmLeaveHistory extends Model<DmLeaveHistoryAttributes, DmLeaveHistoryCreationAttributes> implements DmLeaveHistoryAttributes {
  public id!: number;
  public custId!: number;
  public applyDate!: Date;
  public fromDate!: Date;
  public toDate!: Date;
  public type!: string;
  public approvBy!: string;
  public requestedTo!: string;
  public requested_time_from!: Date;
  public requested_time_to!: Date;
  public remark!: string;
  public status!: number;
  public file!: string;
  public reject!: string;
  public reject_remarks!: string;
  public notf!: number;
  public approved_date!: Date;
  public reject_date!: Date;

  public static associate(models: any) {
  }
}

DmLeaveHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    custId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    applyDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    approvBy: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    requestedTo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    requested_time_from: {
      type: DataTypes.TIME,
      allowNull: false
    },
    requested_time_to: {
      type: DataTypes.TIME,
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    file: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    reject: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    reject_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notf: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reject_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmLeaveHistory',
    tableName: 'dm_leave_history',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeaveHistory };
export type { DmLeaveHistoryAttributes, DmLeaveHistoryCreationAttributes };
