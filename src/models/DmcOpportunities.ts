import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcOpportunitiesAttributes {
  id: number;
  leadId: number;
  opportunityNumber: string;
  opportunityName: string;
  opportunityType: string;
  serviceType: string | null;
  estimatedValue: number;
  actualValue: number;
  currency: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'prospect' | 'qualified' | 'quotation_sent' | 'negotiation' | 'won' | 'lost' | 'closed';
  stage: string;
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate: Date | null;
  description: string;
  serviceRequired: string;
  source: string;
  campaign: string;
  leadSource: string | null;
  branchId: number | null;
  assignedTo: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  lostReason: string | null;
  competitor: string | null;
  nextAction: string;
  nextActionDate: Date | null;
  tags: string;
  notes: string;
  conversionDate: Date | null;
  retentionAmount: number;
  retentionStatus: 'pending' | 'approved' | 'rejected';
  retentionDate: Date | null;
  agreementGenerated: boolean;
  agreementId: number | null;
  agreementSent: boolean;
  agreementSigned: boolean;
  paymentReceived: boolean;
  documentsVerified: boolean;
}

interface DmcOpportunitiesCreationAttributes extends Optional<DmcOpportunitiesAttributes, 'id' | 'opportunityType' | 'serviceType' | 'actualValue' | 'actualCloseDate' | 'source' | 'campaign' | 'leadSource' | 'branchId' | 'lostReason' | 'competitor' | 'nextActionDate' | 'conversionDate' | 'retentionAmount' | 'retentionStatus' | 'retentionDate' | 'agreementId'> {}

class DmcOpportunities extends Model<DmcOpportunitiesAttributes, DmcOpportunitiesCreationAttributes> implements DmcOpportunitiesAttributes {
  public id!: number;
  public leadId!: number;
  public opportunityNumber!: string;
  public opportunityName!: string;
  public opportunityType!: string;
  public serviceType!: string | null;
  public estimatedValue!: number;
  public actualValue!: number;
  public currency!: string;
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public status!: 'prospect' | 'qualified' | 'quotation_sent' | 'negotiation' | 'won' | 'lost' | 'closed';
  public stage!: string;
  public probability!: number;
  public expectedCloseDate!: Date;
  public actualCloseDate!: Date | null;
  public description!: string;
  public serviceRequired!: string;
  public source!: string;
  public campaign!: string;
  public leadSource!: string | null;
  public branchId!: number | null;
  public assignedTo!: number;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lostReason!: string | null;
  public competitor!: string | null;
  public nextAction!: string;
  public nextActionDate!: Date | null;
  public tags!: string;
  public notes!: string;
  public conversionDate!: Date | null;
  public retentionAmount!: number;
  public retentionStatus!: 'pending' | 'approved' | 'rejected';
  public retentionDate!: Date | null;
  public agreementGenerated!: boolean;
  public agreementId!: number | null;
  public agreementSent!: boolean;
  public agreementSigned!: boolean;
  public paymentReceived!: boolean;
  public documentsVerified!: boolean;

  public static associate(models: any) {
    DmcOpportunities.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLead' });
    DmcOpportunities.belongsTo(models.DmEmployee, { foreignKey: 'assignedTo', targetKey: 'id', as: 'assignedEmployee' });
    DmcOpportunities.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
    DmcOpportunities.hasMany(models.DmcOpportunityQuotations, { foreignKey: 'opportunityId', sourceKey: 'id', as: 'opportunityQuotations' });
    DmcOpportunities.hasMany(models.DmcOpportunityPayments, { foreignKey: 'opportunityId', sourceKey: 'id', as: 'dmcOpportunityPayments' });
    DmcOpportunities.hasMany(models.DmcOpportunityDocuments, { foreignKey: 'opportunityId', sourceKey: 'id', as: 'opportunityDocuments' });
    DmcOpportunities.hasMany(models.DmcOpportunityAgreements, { foreignKey: 'opportunityId', sourceKey: 'id', as: 'dmcOpportunityAgreements' });
    DmcOpportunities.hasMany(models.DmcOpportunityActivities, { foreignKey: 'opportunityId', sourceKey: 'id', as: 'dmcOpportunityActivities' });
  }
}

DmcOpportunities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dmc_forum_leads',
        key: 'id'
      }
    },
    opportunityNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    opportunityName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    opportunityType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    serviceType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    actualValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('prospect', 'qualified', 'quotation_sent', 'negotiation', 'won', 'lost', 'closed'),
      allowNull: false,
      defaultValue: 'prospect'
    },
    stage: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'initial'
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    expectedCloseDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    actualCloseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    serviceRequired: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    campaign: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    leadSource: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dm_branch',
        key: 'id'
      }
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    lostReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    competitor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nextAction: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nextActionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    conversionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    retentionAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    retentionStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    retentionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    agreementGenerated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    agreementId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    agreementSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    agreementSigned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    paymentReceived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    documentsVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'DmcOpportunities',
    tableName: 'dmc_opportunities',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcOpportunities };
export type { DmcOpportunitiesAttributes, DmcOpportunitiesCreationAttributes };
