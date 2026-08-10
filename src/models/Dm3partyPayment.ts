import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface Dm3partyPaymentAttributes {
  id: number;
  leadId: number;
  date: Date | null;
  currency_id: number;
  amount: number;
  Tax: number;
  payMethod: string | null;
  emp_id: number;
  receipt_date: Date;
  cc_number: string;
  receipt: string;
  counselor_receipt: string;
  trans_or_ref_number: string;
  remarks: string;
  payoption: string;
  paycardoption: string;
}

type Dm3partyPaymentCreationAttributes = Optional<Dm3partyPaymentAttributes, 'id' | 'date' | 'amount' | 'Tax' | 'payMethod' | 'emp_id'>;

class Dm3partyPayment extends Model<Dm3partyPaymentAttributes, Dm3partyPaymentCreationAttributes> implements Dm3partyPaymentAttributes {
  declare id: number;
  declare leadId: number;
  declare date: Date | null;
  declare currency_id: number;
  declare amount: number;
  declare Tax: number;
  declare payMethod: string | null;
  declare emp_id: number;
  declare receipt_date: Date;
  declare cc_number: string;
  declare receipt: string;
  declare counselor_receipt: string;
  declare trans_or_ref_number: string;
  declare remarks: string;
  declare payoption: string;
  declare paycardoption: string;

  public static associate(models: any) {
    Dm3partyPayment.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
    Dm3partyPayment.hasMany(models.Dm3partyPaymentDet, { foreignKey: 'payId', sourceKey: 'id', as: 'dm3partyPaymentDets' });
  }
}

Dm3partyPayment.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    Tax: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    payMethod: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    receipt_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cc_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    receipt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    counselor_receipt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    trans_or_ref_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payoption: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    paycardoption: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Dm3partyPayment',
    tableName: 'dm_3party_payment',
    timestamps: false,
    freezeTableName: true,
  });

export { Dm3partyPayment };
export type { Dm3partyPaymentAttributes, Dm3partyPaymentCreationAttributes };
