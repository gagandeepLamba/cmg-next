import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmFinanceInvoiceAttributes {
  id: number;
  vendor_id: number;
  batch_id: number;
  ag_no: string;
  invoice: number;
  created: number;
  created_by: number;
}

interface DmFinanceInvoiceCreationAttributes extends Optional<DmFinanceInvoiceAttributes, never> {}

class DmFinanceInvoice extends Model<DmFinanceInvoiceAttributes, DmFinanceInvoiceCreationAttributes> implements DmFinanceInvoiceAttributes {
  declare id: number;
  declare vendor_id: number;
  declare batch_id: number;
  declare ag_no: string;
  declare invoice: number;
  declare created: number;
  declare created_by: number;

  public static associate(models: any) {
  }
}

DmFinanceInvoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ag_no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    invoice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmFinanceInvoice',
    tableName: 'dm_finance_invoice',
    timestamps: false,
    freezeTableName: true,
  });

export { DmFinanceInvoice };
export type { DmFinanceInvoiceAttributes, DmFinanceInvoiceCreationAttributes };
