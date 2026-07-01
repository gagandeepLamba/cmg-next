import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmPayHistoryCrossBranchAttributes {
  id: number;
  leadId: number;
  amount: number;
  counselor_receipt: string;
  date: Date | null;
  payMethod: string | null;
  payBalance: number;
  tax: number;
  payCategory: string | null;
  payment_remarks: string;
  status: number;
  remark: string | null;
  canDate: Date | null;
  thirdPartyAmt: number;
  dmAmt: number;
  dmTax: number;
  dmRefundAmt: number;
  curValue: number;
  refNumber: string;
  created_by: number;
  stage: string;
}

interface DmPayHistoryCrossBranchCreationAttributes extends Optional<DmPayHistoryCrossBranchAttributes, 'amount' | 'date' | 'payMethod' | 'tax' | 'payCategory' | 'status' | 'remark' | 'canDate'> {}

class DmPayHistoryCrossBranch extends Model<DmPayHistoryCrossBranchAttributes, DmPayHistoryCrossBranchCreationAttributes> implements DmPayHistoryCrossBranchAttributes {
  public id!: number;
  public leadId!: number;
  public amount!: number;
  public counselor_receipt!: string;
  public date!: Date | null;
  public payMethod!: string | null;
  public payBalance!: number;
  public tax!: number;
  public payCategory!: string | null;
  public payment_remarks!: string;
  public status!: number;
  public remark!: string | null;
  public canDate!: Date | null;
  public thirdPartyAmt!: number;
  public dmAmt!: number;
  public dmTax!: number;
  public dmRefundAmt!: number;
  public curValue!: number;
  public refNumber!: string;
  public created_by!: number;
  public stage!: string;

  public static associate(models: any) {
  }
}

DmPayHistoryCrossBranch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    counselor_receipt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    payMethod: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    payBalance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    payCategory: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payment_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    canDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    thirdPartyAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    dmAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    dmTax: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    dmRefundAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    curValue: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refNumber: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmPayHistoryCrossBranch',
    tableName: 'dm_pay_history_cross_branch',
    timestamps: false,
    freezeTableName: true,
  });

export { DmPayHistoryCrossBranch };
export type { DmPayHistoryCrossBranchAttributes, DmPayHistoryCrossBranchCreationAttributes };
