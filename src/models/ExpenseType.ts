import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface ExpenseTypeAttributes {
  id: number;
  expense_type: string;
  status: number;
  created: Date;
  created_by: number;
}

interface ExpenseTypeCreationAttributes extends Optional<ExpenseTypeAttributes, never> {}

class ExpenseType extends Model<ExpenseTypeAttributes, ExpenseTypeCreationAttributes> implements ExpenseTypeAttributes {
  public id!: number;
  public expense_type!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

ExpenseType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    expense_type: {
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
    modelName: 'ExpenseType',
    tableName: 'expense_type',
    timestamps: false,
    freezeTableName: true,
  });

export { ExpenseType };
export type { ExpenseTypeAttributes, ExpenseTypeCreationAttributes };
