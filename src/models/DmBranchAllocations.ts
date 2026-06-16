import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmBranchAllocationsAttributes {
  id: number;
  emp_id: number;
  branches: string;
  status: number;
  created: Date;
  created_by: number;
}

interface DmBranchAllocationsCreationAttributes extends Optional<DmBranchAllocationsAttributes, never> {}

class DmBranchAllocations extends Model<DmBranchAllocationsAttributes, DmBranchAllocationsCreationAttributes> implements DmBranchAllocationsAttributes {
  public id!: number;
  public emp_id!: number;
  public branches!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmBranchAllocations.init(
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
    branches: {
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
    modelName: 'DmBranchAllocations',
    tableName: 'dm_branch_allocations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBranchAllocations };
export type { DmBranchAllocationsAttributes, DmBranchAllocationsCreationAttributes };
