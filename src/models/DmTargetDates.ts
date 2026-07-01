import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmTargetDatesAttributes {
  id: number;
  month: string;
  start_date: Date;
  end_date: Date;
  status: number;
  created: Date;
}

interface DmTargetDatesCreationAttributes extends Optional<DmTargetDatesAttributes, never> {}

class DmTargetDates extends Model<DmTargetDatesAttributes, DmTargetDatesCreationAttributes> implements DmTargetDatesAttributes {
  public id!: number;
  public month!: string;
  public start_date!: Date;
  public end_date!: Date;
  public status!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmTargetDates.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    month: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
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
    modelName: 'DmTargetDates',
    tableName: 'dm_target_dates',
    timestamps: false,
    freezeTableName: true,
  });

export { DmTargetDates };
export type { DmTargetDatesAttributes, DmTargetDatesCreationAttributes };
