import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOperationAllocationsAttributes {
  id: number;
  case_officer: number;
  branch: number;
  type: string;
  start_date: Date;
  end_date: Date;
  created: Date;
  created_by: number;
  status: number;
  is_deleted: number;
}

interface DmOperationAllocationsCreationAttributes extends Optional<DmOperationAllocationsAttributes, never> {}

class DmOperationAllocations extends Model<DmOperationAllocationsAttributes, DmOperationAllocationsCreationAttributes> implements DmOperationAllocationsAttributes {
  public id!: number;
  public case_officer!: number;
  public branch!: number;
  public type!: string;
  public start_date!: Date;
  public end_date!: Date;
  public created!: Date;
  public created_by!: number;
  public status!: number;
  public is_deleted!: number;

  public static associate(models: any) {
  }
}

DmOperationAllocations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    case_officer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOperationAllocations',
    tableName: 'dm_operation_allocations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOperationAllocations };
export type { DmOperationAllocationsAttributes, DmOperationAllocationsCreationAttributes };
