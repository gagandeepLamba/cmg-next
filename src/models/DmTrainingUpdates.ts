import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmTrainingUpdatesAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: Date | null;
  status: number;
}

interface DmTrainingUpdatesCreationAttributes extends Optional<DmTrainingUpdatesAttributes, 'userid' | 'file' | 'date'> {}

class DmTrainingUpdates extends Model<DmTrainingUpdatesAttributes, DmTrainingUpdatesCreationAttributes> implements DmTrainingUpdatesAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: Date | null;
  public status!: number;

  public static associate(models: any) {
  }
}

DmTrainingUpdates.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmTrainingUpdates',
    tableName: 'dm_training_updates',
    timestamps: false,
    freezeTableName: true,
  });

export { DmTrainingUpdates };
export type { DmTrainingUpdatesAttributes, DmTrainingUpdatesCreationAttributes };
