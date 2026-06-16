import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmThirdPartyPaymentsAttributes {
  id: number;
  leadId: number;
  payment: number;
  payment_proof: string;
  tax: number;
  balance: number;
  approved: number;
  approved_by: number;
  approved_date: Date;
  created_by: number;
  created: Date;
  reject_remarks: string;
}

interface DmThirdPartyPaymentsCreationAttributes extends Optional<DmThirdPartyPaymentsAttributes, never> {}

class DmThirdPartyPayments extends Model<DmThirdPartyPaymentsAttributes, DmThirdPartyPaymentsCreationAttributes> implements DmThirdPartyPaymentsAttributes {
  public id!: number;
  public leadId!: number;
  public payment!: number;
  public payment_proof!: string;
  public tax!: number;
  public balance!: number;
  public approved!: number;
  public approved_by!: number;
  public approved_date!: Date;
  public created_by!: number;
  public created!: Date;
  public reject_remarks!: string;

  public static associate(models: any) {
  }
}

DmThirdPartyPayments.init(
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
    payment: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payment_proof: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    approved: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_date: {
      type: DataTypes.DATE,
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
    reject_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmThirdPartyPayments',
    tableName: 'dm_third_party_payments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmThirdPartyPayments };
export type { DmThirdPartyPaymentsAttributes, DmThirdPartyPaymentsCreationAttributes };
