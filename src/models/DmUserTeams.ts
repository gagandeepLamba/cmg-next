import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmUserTeamsAttributes {
  id: number;
  user_id: number;
  team_id: number;
}

interface DmUserTeamsCreationAttributes extends Optional<DmUserTeamsAttributes, never> {}

class DmUserTeams extends Model<DmUserTeamsAttributes, DmUserTeamsCreationAttributes> implements DmUserTeamsAttributes {
  public id!: number;
  public user_id!: number;
  public team_id!: number;

  public static associate(models: any) {
  }
}

DmUserTeams.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmUserTeams',
    tableName: 'dm_user_teams',
    timestamps: false,
    freezeTableName: true,
  });

export { DmUserTeams };
export type { DmUserTeamsAttributes, DmUserTeamsCreationAttributes };
