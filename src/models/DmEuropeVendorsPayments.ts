import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEuropeVendorsPaymentsAttributes {
  id: number;
  lead_id: number;
  vendor_id: number;
  batch_id: number;
  pay_amount: number;
  pay_status: number;
  pay_date: Date;
  invoice_number: string;
  created_by: number;
  created: Date;
  sent_email: number;
}

interface DmEuropeVendorsPaymentsCreationAttributes extends Optional<DmEuropeVendorsPaymentsAttributes, never> {}

class DmEuropeVendorsPayments extends Model<DmEuropeVendorsPaymentsAttributes, DmEuropeVendorsPaymentsCreationAttributes> implements DmEuropeVendorsPaymentsAttributes {
  public id!: number;
  public lead_id!: number;
  public vendor_id!: number;
  public batch_id!: number;
  public pay_amount!: number;
  public pay_status!: number;
  public pay_date!: Date;
  public invoice_number!: string;
  public created_by!: number;
  public created!: Date;
  public sent_email!: number;

  public static associate(models: any) {
  }
}

DmEuropeVendorsPayments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pay_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    pay_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pay_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    invoice_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sent_email: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEuropeVendorsPayments',
    tableName: 'dm_europe_vendors_payments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEuropeVendorsPayments };
export type { DmEuropeVendorsPaymentsAttributes, DmEuropeVendorsPaymentsCreationAttributes };
