import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmTeamsAttributes {
  id: number;
  team: string;
  status: number;
  created: Date;
  created_by: number;
}

interface DmTeamsCreationAttributes extends Optional<DmTeamsAttributes, never> {}

class DmTeams extends Model<DmTeamsAttributes, DmTeamsCreationAttributes> implements DmTeamsAttributes {
  public id!: number;
  public team!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmTeams.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    team: {
      type: DataTypes.STRING(100),
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
    modelName: 'DmTeams',
    tableName: 'dm_teams',
    timestamps: false,
    freezeTableName: true,
  });

export { DmTeams };
export type { DmTeamsAttributes, DmTeamsCreationAttributes };
