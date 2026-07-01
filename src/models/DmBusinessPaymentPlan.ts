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
  public leadId!: number;
  public legal_fees!: number;
  public total_fees!: number;
  public vat!: number;
  public first_payment!: number;
  public due_diligence_fees!: number;
  public government_application_fees!: number;
  public government_passport_fees!: number;
  public governement_cert_of_naturalization!: number;
  public second_payment!: number;
  public bank_charges!: number;
  public refund!: number;
  public balance_payment!: number;
  public created!: Date;
  public created_by!: number;
  public id!: number;

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
