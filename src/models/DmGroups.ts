import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmGroupsAttributes {
  id: number;
  team_id: number;
  desgination_id: number;
}

interface DmGroupsCreationAttributes extends Optional<DmGroupsAttributes, never> {}

class DmGroups extends Model<DmGroupsAttributes, DmGroupsCreationAttributes> implements DmGroupsAttributes {
  public id!: number;
  public team_id!: number;
  public desgination_id!: number;

  public static associate(models: any) {
  }
}

DmGroups.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    desgination_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmGroups',
    tableName: 'dm_groups',
    timestamps: false,
    freezeTableName: true,
  });

export { DmGroups };
export type { DmGroupsAttributes, DmGroupsCreationAttributes };
