import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmB2bInvoicesAttributes {
  id: number;
  region: number | null;
  receipt: string;
  branch: number | null;
  company: string | null;
  purpose: string | null;
  narration: string | null;
  vat: number | null;
  taxAmt: number | null;
  totPayAmt: number | null;
  payBalance: number;
  payment_mode: string | null;
  amount: number | null;
  discount: number | null;
  status: number | null;
  created: Date | null;
  Counsilor: number | null;
  created_by: number | null;
}

interface DmB2bInvoicesCreationAttributes extends Optional<DmB2bInvoicesAttributes, 'region' | 'branch' | 'company' | 'purpose' | 'narration' | 'vat' | 'taxAmt' | 'totPayAmt' | 'payment_mode' | 'amount' | 'discount' | 'status' | 'created' | 'Counsilor' | 'created_by'> {}

class DmB2bInvoices extends Model<DmB2bInvoicesAttributes, DmB2bInvoicesCreationAttributes> implements DmB2bInvoicesAttributes {
  public id!: number;
  public region!: number | null;
  public receipt!: string;
  public branch!: number | null;
  public company!: string | null;
  public purpose!: string | null;
  public narration!: string | null;
  public vat!: number | null;
  public taxAmt!: number | null;
  public totPayAmt!: number | null;
  public payBalance!: number;
  public payment_mode!: string | null;
  public amount!: number | null;
  public discount!: number | null;
  public status!: number | null;
  public created!: Date | null;
  public Counsilor!: number | null;
  public created_by!: number | null;

  public static associate(models: any) {
  }
}

DmB2bInvoices.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    receipt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    narration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    taxAmt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totPayAmt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    payBalance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payment_mode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Counsilor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmB2bInvoices',
    tableName: 'dm_b2b_invoices',
    timestamps: false,
    freezeTableName: true,
  });

export { DmB2bInvoices };
export type { DmB2bInvoicesAttributes, DmB2bInvoicesCreationAttributes };
