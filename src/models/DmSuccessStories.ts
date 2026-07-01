import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmSuccessStoriesAttributes {
  id: number;
  folder_id: number;
  files: string;
  sub_folder_id: number;
  created_by: number;
  created: Date;
  is_deleted: number;
}

interface DmSuccessStoriesCreationAttributes extends Optional<DmSuccessStoriesAttributes, never> {}

class DmSuccessStories extends Model<DmSuccessStoriesAttributes, DmSuccessStoriesCreationAttributes> implements DmSuccessStoriesAttributes {
  public id!: number;
  public folder_id!: number;
  public files!: string;
  public sub_folder_id!: number;
  public created_by!: number;
  public created!: Date;
  public is_deleted!: number;

  public static associate(models: any) {
  }
}

DmSuccessStories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    folder_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    files: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sub_folder_id: {
      type: DataTypes.INTEGER,
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
    modelName: 'DmSuccessStories',
    tableName: 'dm_success_stories',
    timestamps: false,
    freezeTableName: true,
  });

export { DmSuccessStories };
export type { DmSuccessStoriesAttributes, DmSuccessStoriesCreationAttributes };
