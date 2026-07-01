import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOldDataAttributes {
  id: number;
  col_0: string;
  col_1: string;
  col_2: string;
  col_3: string;
  col_4: string;
  col_5: string;
  col_6: string;
  col_7: string;
  col_8: string;
  col_9: string;
  col_10: string;
  col_11: string;
  col_12: string;
  col_13: string;
  col_14: string;
  col_15: string;
  col_16: string;
  col_17: string;
  col_18: string;
  col_19: string;
  col_20: string;
  col_21: string;
  col_22: string;
  col_23: string;
  col_24: string;
}

interface DmOldDataCreationAttributes extends Optional<DmOldDataAttributes, never> {}

class DmOldData extends Model<DmOldDataAttributes, DmOldDataCreationAttributes> implements DmOldDataAttributes {
  public id!: number;
  public col_0!: string;
  public col_1!: string;
  public col_2!: string;
  public col_3!: string;
  public col_4!: string;
  public col_5!: string;
  public col_6!: string;
  public col_7!: string;
  public col_8!: string;
  public col_9!: string;
  public col_10!: string;
  public col_11!: string;
  public col_12!: string;
  public col_13!: string;
  public col_14!: string;
  public col_15!: string;
  public col_16!: string;
  public col_17!: string;
  public col_18!: string;
  public col_19!: string;
  public col_20!: string;
  public col_21!: string;
  public col_22!: string;
  public col_23!: string;
  public col_24!: string;

  public static associate(models: any) {
  }
}

DmOldData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    col_0: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_3: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_4: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_5: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_6: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_7: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_8: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_9: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_10: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_11: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_12: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_13: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_14: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_15: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_16: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_17: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_18: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_19: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_20: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_21: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_22: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_23: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    col_24: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOldData',
    tableName: 'dm_old_data',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOldData };
export type { DmOldDataAttributes, DmOldDataCreationAttributes };
