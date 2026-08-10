import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmBusinessPaymentPlanAttributes {
  leadId: number;
  legal_fees: number;
  total_fees: number;
  vat: number;
  first_payment: number;
  due_diligence_fees: number;
  government_application_fees: number;
  government_passport_fees: number;
  governement_cert_of_naturalization: number;
  second_payment: number;
  bank_charges: number;
  refund: number;
  balance_payment: number;
  created: Date;
  created_by: number;
  id: number;
}

interface DmBusinessPaymentPlanCreationAttributes extends Optional<DmBusinessPaymentPlanAttributes, never> {}

class DmBusinessPaymentPlan extends Model<DmBusinessPaymentPlanAttributes, DmBusinessPaymentPlanCreationAttributes> implements DmBusinessPaymentPlanAttributes {
  declare leadId: number;
  declare legal_fees: number;
  declare total_fees: number;
  declare vat: number;
  declare first_payment: number;
  declare due_diligence_fees: number;
  declare government_application_fees: number;
  declare government_passport_fees: number;
  declare governement_cert_of_naturalization: number;
  declare second_payment: number;
  declare bank_charges: number;
  declare refund: number;
  declare balance_payment: number;
  declare created: Date;
  declare created_by: number;
  declare id: number;

  public static associate(models: any) {
  }
}

DmBusinessPaymentPlan.init(
  {
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    legal_fees: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    total_fees: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    vat: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    first_payment: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    due_diligence_fees: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    government_application_fees: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    government_passport_fees: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    governement_cert_of_naturalization: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    second_payment: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    bank_charges: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    refund: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    balance_payment: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
  },
  {
    sequelize,
    modelName: 'DmBusinessPaymentPlan',
    tableName: 'dm_business_payment_plan',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBusinessPaymentPlan };
export type { DmBusinessPaymentPlanAttributes, DmBusinessPaymentPlanCreationAttributes };
