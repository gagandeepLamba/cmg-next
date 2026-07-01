import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmUserBranchesAttributes {
  id: number;
  user_id: number;
  branch_id: number;
}

interface DmUserBranchesCreationAttributes extends Optional<DmUserBranchesAttributes, never> {}

class DmUserBranches extends Model<DmUserBranchesAttributes, DmUserBranchesCreationAttributes> implements DmUserBranchesAttributes {
  public id!: number;
  public user_id!: number;
  public branch_id!: number;

  public static associate(models: any) {
  }
}

DmUserBranches.init(
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
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmUserBranches',
    tableName: 'dm_user_branches',
    timestamps: false,
    freezeTableName: true,
  });

export { DmUserBranches };
export type { DmUserBranchesAttributes, DmUserBranchesCreationAttributes };
