import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmObservationFileAttributes {
  id: number;
  country: number;
  service: number;
  file: string;
  status: number;
}

interface DmObservationFileCreationAttributes extends Optional<DmObservationFileAttributes, 'status'> {}

class DmObservationFile extends Model<DmObservationFileAttributes, DmObservationFileCreationAttributes> implements DmObservationFileAttributes {
  public id!: number;
  public country!: number;
  public service!: number;
  public file!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmObservationFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  {
    sequelize,
    modelName: 'DmObservationFile',
    tableName: 'dm_observation_file',
    timestamps: false,
    freezeTableName: true,
  });

export { DmObservationFile };
export type { DmObservationFileAttributes, DmObservationFileCreationAttributes };
