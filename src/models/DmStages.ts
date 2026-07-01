import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmStagesAttributes {
  id: number;
  stage: string;
  duration: number;
  duration_type: string;
  status: number;
  created: Date;
  is_deleted: number;
}

interface DmStagesCreationAttributes extends Optional<DmStagesAttributes, 'status' | 'is_deleted'> {}

class DmStages extends Model<DmStagesAttributes, DmStagesCreationAttributes> implements DmStagesAttributes {
  public id!: number;
  public stage!: string;
  public duration!: number;
  public duration_type!: string;
  public status!: number;
  public created!: Date;
  public is_deleted!: number;

  public static associate(models: any) {
  }
}

DmStages.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stage: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },
  {
    sequelize,
    modelName: 'DmStages',
    tableName: 'dm_stages',
    timestamps: false,
    freezeTableName: true,
  });

export { DmStages };
export type { DmStagesAttributes, DmStagesCreationAttributes };
