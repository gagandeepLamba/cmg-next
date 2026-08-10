import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmExpenseCashAttributes {
  id: number;
  emp_id: number;
  cash: number;
  branch: number;
  created: Date;
}

interface DmExpenseCashCreationAttributes extends Optional<DmExpenseCashAttributes, never> {}

class DmExpenseCash extends Model<DmExpenseCashAttributes, DmExpenseCashCreationAttributes> implements DmExpenseCashAttributes {
  declare id: number;
  declare emp_id: number;
  declare cash: number;
  declare branch: number;
  declare created: Date;

  public static associate(models: any) {
  }
}

DmExpenseCash.init(
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
    cash: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmExpenseCash',
    tableName: 'dm_expense_cash',
    timestamps: false,
    freezeTableName: true,
  });

export { DmExpenseCash };
export type { DmExpenseCashAttributes, DmExpenseCashCreationAttributes };
