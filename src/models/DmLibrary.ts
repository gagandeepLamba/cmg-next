import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLibraryAttributes {
  id: number;
  groups: number;
  file_name: string;
  files: string;
  file_type: number;
  file_of_folder: number;
  folder_id: number;
  status: number;
  created: Date;
  created_by: number;
}

interface DmLibraryCreationAttributes extends Optional<DmLibraryAttributes, never> {}

class DmLibrary extends Model<DmLibraryAttributes, DmLibraryCreationAttributes> implements DmLibraryAttributes {
  public id!: number;
  public groups!: number;
  public file_name!: string;
  public files!: string;
  public file_type!: number;
  public file_of_folder!: number;
  public folder_id!: number;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmLibrary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groups: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    files: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file_of_folder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    folder_id: {
      type: DataTypes.INTEGER,
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmLibrary',
    tableName: 'dm_library',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLibrary };
export type { DmLibraryAttributes, DmLibraryCreationAttributes };
