import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface IeltsReportAttributes {
  id: number;
  date: string;
  start: string | null;
  end: string | null;
  remarks: string | null;
}

interface IeltsReportCreationAttributes extends Optional<IeltsReportAttributes, 'start' | 'end' | 'remarks'> {}

class IeltsReport extends Model<IeltsReportAttributes, IeltsReportCreationAttributes> implements IeltsReportAttributes {
  public id!: number;
  public date!: string;
  public start!: string | null;
  public end!: string | null;
  public remarks!: string | null;

  public static associate(models: any) {
  }
}

IeltsReport.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    start: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    end: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'IeltsReport',
    tableName: 'ielts_report',
    timestamps: false,
    freezeTableName: true,
  });

export { IeltsReport };
export type { IeltsReportAttributes, IeltsReportCreationAttributes };
