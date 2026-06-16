import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmBusinessPortugalPaymentPlanAttributes {
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
  created: Date;
  created_by: number;
  id: number;
}

interface DmBusinessPortugalPaymentPlanCreationAttributes extends Optional<DmBusinessPortugalPaymentPlanAttributes, never> {}

class DmBusinessPortugalPaymentPlan extends Model<DmBusinessPortugalPaymentPlanAttributes, DmBusinessPortugalPaymentPlanCreationAttributes> implements DmBusinessPortugalPaymentPlanAttributes {
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
  public created!: Date;
  public created_by!: number;
  public id!: number;

  public static associate(models: any) {
  }
}

DmBusinessPortugalPaymentPlan.init(
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
    modelName: 'DmBusinessPortugalPaymentPlan',
    tableName: 'dm_business_portugal_payment_plan',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBusinessPortugalPaymentPlan };
export type { DmBusinessPortugalPaymentPlanAttributes, DmBusinessPortugalPaymentPlanCreationAttributes };
