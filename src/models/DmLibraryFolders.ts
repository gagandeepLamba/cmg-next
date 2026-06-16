import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLibraryFoldersAttributes {
  id: number;
  folder_name: string;
  created: Date;
  created_by: number;
}

interface DmLibraryFoldersCreationAttributes extends Optional<DmLibraryFoldersAttributes, never> {}

class DmLibraryFolders extends Model<DmLibraryFoldersAttributes, DmLibraryFoldersCreationAttributes> implements DmLibraryFoldersAttributes {
  public id!: number;
  public folder_name!: string;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmLibraryFolders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    folder_name: {
      type: DataTypes.STRING(255),
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
    modelName: 'DmLibraryFolders',
    tableName: 'dm_library_folders',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLibraryFolders };
export type { DmLibraryFoldersAttributes, DmLibraryFoldersCreationAttributes };
