import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmOpportunityComplianceApprovalsAttributes {
  id: number;
  leadId: number;
  opportunityId: number | null;
  signedAgreementUrl: string;
  clientSignature: string | null;
  signatureDate: Date | null;
  status: string;
  submittedBy: number | null;
  reviewedBy: string | null;
  reviewerRole: string | null;
  reviewNotes: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DmOpportunityComplianceApprovalsCreationAttributes extends Optional<DmOpportunityComplianceApprovalsAttributes, 'id' | 'opportunityId' | 'clientSignature' | 'signatureDate' | 'status' | 'submittedBy' | 'reviewedBy' | 'reviewerRole' | 'reviewNotes' | 'reviewedAt'> {}

class DmOpportunityComplianceApprovals extends Model<DmOpportunityComplianceApprovalsAttributes, DmOpportunityComplianceApprovalsCreationAttributes> implements DmOpportunityComplianceApprovalsAttributes {
  public id!: number;
  public leadId!: number;
  public opportunityId!: number | null;
  public signedAgreementUrl!: string;
  public clientSignature!: string | null;
  public signatureDate!: Date | null;
  public status!: string;
  public submittedBy!: number | null;
  public reviewedBy!: string | null;
  public reviewerRole!: string | null;
  public reviewNotes!: string | null;
  public submittedAt!: Date;
  public reviewedAt!: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmOpportunityComplianceApprovals.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' });
    DmOpportunityComplianceApprovals.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'opportunity' });
    DmOpportunityComplianceApprovals.belongsTo(models.DmEmployee, { foreignKey: 'submittedBy', targetKey: 'id', as: 'submittedEmployee' });
  }
}

DmOpportunityComplianceApprovals.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    leadId: { type: DataTypes.INTEGER, allowNull: false },
    opportunityId: { type: DataTypes.INTEGER, allowNull: true },
    signedAgreementUrl: { type: DataTypes.TEXT, allowNull: false },
    clientSignature: { type: DataTypes.STRING(255), allowNull: true },
    signatureDate: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'pending' },
    submittedBy: { type: DataTypes.INTEGER, allowNull: true },
    reviewedBy: { type: DataTypes.STRING(255), allowNull: true },
    reviewerRole: { type: DataTypes.STRING(80), allowNull: true },
    reviewNotes: { type: DataTypes.TEXT, allowNull: true },
    submittedAt: { type: DataTypes.DATE, allowNull: false },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'DmOpportunityComplianceApprovals',
    tableName: 'dm_opportunity_compliance_approvals',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmOpportunityComplianceApprovals };
export type { DmOpportunityComplianceApprovalsAttributes, DmOpportunityComplianceApprovalsCreationAttributes };
