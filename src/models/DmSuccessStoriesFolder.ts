import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmSuccessStoriesFolderAttributes {
  id: number;
  parent_id: number;
  folder: string;
  created_by: number;
  created: Date;
  is_deleted: number;
}

interface DmSuccessStoriesFolderCreationAttributes extends Optional<DmSuccessStoriesFolderAttributes, never> {}

class DmSuccessStoriesFolder extends Model<DmSuccessStoriesFolderAttributes, DmSuccessStoriesFolderCreationAttributes> implements DmSuccessStoriesFolderAttributes {
  public id!: number;
  public parent_id!: number;
  public folder!: string;
  public created_by!: number;
  public created!: Date;
  public is_deleted!: number;

  public static associate(models: any) {
  }
}

DmSuccessStoriesFolder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    folder: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmSuccessStoriesFolder',
    tableName: 'dm_success_stories_folder',
    timestamps: false,
    freezeTableName: true,
  });

export { DmSuccessStoriesFolder };
export type { DmSuccessStoriesFolderAttributes, DmSuccessStoriesFolderCreationAttributes };
