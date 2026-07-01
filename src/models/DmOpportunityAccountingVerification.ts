import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmOpportunityAccountingVerificationAttributes {
  id: number;
  leadId: number;
  opportunityId: number;
  paymentProofUrl: string | null;
  paymentReceived: boolean;
  documentsComplete: boolean;
  status: 'pending' | 'approved' | 'rejected';
  accountantId: number | null;
  notes: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
}

interface DmOpportunityAccountingVerificationCreationAttributes extends Optional<DmOpportunityAccountingVerificationAttributes, 'id' | 'paymentProofUrl' | 'paymentReceived' | 'documentsComplete' | 'status' | 'accountantId' | 'notes' | 'reviewedAt'> {}

class DmOpportunityAccountingVerification extends Model<DmOpportunityAccountingVerificationAttributes, DmOpportunityAccountingVerificationCreationAttributes> implements DmOpportunityAccountingVerificationAttributes {
  declare id: number;
  declare leadId: number;
  declare opportunityId: number;
  declare paymentProofUrl: string | null;
  declare paymentReceived: boolean;
  declare documentsComplete: boolean;
  declare status: 'pending' | 'approved' | 'rejected';
  declare accountantId: number | null;
  declare notes: string | null;
  declare submittedAt: Date;
  declare reviewedAt: Date | null;

  public static associate(models: any) {
    DmOpportunityAccountingVerification.belongsTo(models.DmcForumLeads, { foreignKey: 'lead_id', targetKey: 'id', as: 'lead' });
    DmOpportunityAccountingVerification.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunity_id', targetKey: 'id', as: 'opportunity' });
    DmOpportunityAccountingVerification.belongsTo(models.DmEmployee, { foreignKey: 'accountant_id', targetKey: 'id', as: 'accountant' });
  }
}

DmOpportunityAccountingVerification.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: 'id' },
    leadId: { type: DataTypes.INTEGER, allowNull: false, field: 'lead_id', references: { model: 'dmc_forum_leads', key: 'id' } },
    opportunityId: { type: DataTypes.INTEGER, allowNull: false, field: 'opportunity_id', references: { model: 'dmc_opportunities', key: 'id' } },
    paymentProofUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'payment_proof_url' },
    paymentReceived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'payment_received' },
    documentsComplete: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'documents_complete' },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending', field: 'status' },
    accountantId: { type: DataTypes.INTEGER, allowNull: true, field: 'accountant_id', references: { model: 'dm_employee', key: 'id' } },
    notes: { type: DataTypes.TEXT, allowNull: true, field: 'notes' },
    submittedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'submitted_at' },
    reviewedAt: { type: DataTypes.DATE, allowNull: true, field: 'reviewed_at' }
  },
  {
    sequelize,
    modelName: 'DmOpportunityAccountingVerification',
    tableName: 'dm_opportunity_accounting_verifications',
    timestamps: false,
    freezeTableName: true,
  }
);

export { DmOpportunityAccountingVerification };
export type { DmOpportunityAccountingVerificationAttributes, DmOpportunityAccountingVerificationCreationAttributes };
