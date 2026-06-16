import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCounsilorAllocationsAttributes {
  id: number;
  branch_id: number;
  counsilors: string;
  status: number;
  created: Date;
  created_by: number;
}

interface DmCounsilorAllocationsCreationAttributes extends Optional<DmCounsilorAllocationsAttributes, never> {}

class DmCounsilorAllocations extends Model<DmCounsilorAllocationsAttributes, DmCounsilorAllocationsCreationAttributes> implements DmCounsilorAllocationsAttributes {
  public id!: number;
  public branch_id!: number;
  public counsilors!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmCounsilorAllocations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    counsilors: {
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
    modelName: 'DmCounsilorAllocations',
    tableName: 'dm_counsilor_allocations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCounsilorAllocations };
export type { DmCounsilorAllocationsAttributes, DmCounsilorAllocationsCreationAttributes };
