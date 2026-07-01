import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmExpenseAttributes {
  id: number;
  date: Date;
  particular: string;
  amount: number;
  vat: number;
  addBy: number;
  remark: string;
  region: number;
  branch: number;
  receipt: string;
  is_approval: number;
  mgmt_approval: number;
  expense_type: number;
  transaction_type: string;
}

interface DmExpenseCreationAttributes extends Optional<DmExpenseAttributes, never> {}

class DmExpense extends Model<DmExpenseAttributes, DmExpenseCreationAttributes> implements DmExpenseAttributes {
  public id!: number;
  public date!: Date;
  public particular!: string;
  public amount!: number;
  public vat!: number;
  public addBy!: number;
  public remark!: string;
  public region!: number;
  public branch!: number;
  public receipt!: string;
  public is_approval!: number;
  public mgmt_approval!: number;
  public expense_type!: number;
  public transaction_type!: string;

  public static associate(models: any) {
  }
}

DmExpense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    particular: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    vat: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    addBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receipt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    is_approval: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mgmt_approval: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expense_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmExpense',
    tableName: 'dm_expense',
    timestamps: false,
    freezeTableName: true,
  });

export { DmExpense };
export type { DmExpenseAttributes, DmExpenseCreationAttributes };
