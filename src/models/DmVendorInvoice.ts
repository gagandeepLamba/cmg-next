import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmVendorInvoiceAttributes {
  id: number;
  vendor_id: number;
  batch_id: number;
  ag_no: string;
  invoice: number;
  created: number;
  created_by: number;
}

interface DmVendorInvoiceCreationAttributes extends Optional<DmVendorInvoiceAttributes, never> {}

class DmVendorInvoice extends Model<DmVendorInvoiceAttributes, DmVendorInvoiceCreationAttributes> implements DmVendorInvoiceAttributes {
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

DmVendorInvoice.init(
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
    modelName: 'DmVendorInvoice',
    tableName: 'dm_vendor_invoice',
    timestamps: false,
    freezeTableName: true,
  });

export { DmVendorInvoice };
export type { DmVendorInvoiceAttributes, DmVendorInvoiceCreationAttributes };
