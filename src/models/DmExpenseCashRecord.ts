import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmExpenseCashRecordAttributes {
  id: number;
  expense_id: number;
  amount: number;
  amount_spend: number;
  balance: number;
  emp_id: number;
  branch: number;
  type: string;
  created: Date;
}

interface DmExpenseCashRecordCreationAttributes extends Optional<DmExpenseCashRecordAttributes, never> {}

class DmExpenseCashRecord extends Model<DmExpenseCashRecordAttributes, DmExpenseCashRecordCreationAttributes> implements DmExpenseCashRecordAttributes {
  declare id: number;
  declare expense_id: number;
  declare amount: number;
  declare amount_spend: number;
  declare balance: number;
  declare emp_id: number;
  declare branch: number;
  declare type: string;
  declare created: Date;

  public static associate(models: any) {
  }
}

DmExpenseCashRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    amount_spend: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmExpenseCashRecord',
    tableName: 'dm_expense_cash_record',
    timestamps: false,
    freezeTableName: true,
  });

export { DmExpenseCashRecord };
export type { DmExpenseCashRecordAttributes, DmExpenseCashRecordCreationAttributes };
