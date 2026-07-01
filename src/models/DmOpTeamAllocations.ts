import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpTeamAllocationsAttributes {
  id: number;
  emp_id: number;
  teams: string;
  status: number;
  created: Date;
  created_by: number;
}

interface DmOpTeamAllocationsCreationAttributes extends Optional<DmOpTeamAllocationsAttributes, never> {}

class DmOpTeamAllocations extends Model<DmOpTeamAllocationsAttributes, DmOpTeamAllocationsCreationAttributes> implements DmOpTeamAllocationsAttributes {
  public id!: number;
  public emp_id!: number;
  public teams!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmOpTeamAllocations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teams: {
      type: DataTypes.STRING(255),
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
    modelName: 'DmOpTeamAllocations',
    tableName: 'dm_op_team_allocations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpTeamAllocations };
export type { DmOpTeamAllocationsAttributes, DmOpTeamAllocationsCreationAttributes };
