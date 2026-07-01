import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcOpportunityAgreementsAttributes {
  id: number;
  opportunityId: number;
  agreementNumber: string;
  agreementType: string;
  templateId: number | null;
  agreementTitle: string;
  title: string | null;
  description: string | null;
  duration: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  totalAmount: number | null;
  currency: string;
  terms: string;
  termsAndConditions: string | null;
  specialConditions: string;
  content: string | null;
  status: 'draft' | 'generated' | 'sent' | 'signed' | 'uploaded' | 'expired';
  generatedDate: Date;
  sentDate: Date | null;
  signedDate: Date | null;
  clientSignature: string | null;
  signatureDate: Date | null;
  documentUrl: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  companyName: string | null;
  companyAddress: string | null;
  uploadedToCrm: boolean;
  uploadedBy: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcOpportunityAgreementsCreationAttributes extends Optional<DmcOpportunityAgreementsAttributes, 'id' | 'templateId' | 'agreementTitle' | 'title' | 'description' | 'duration' | 'totalAmount' | 'termsAndConditions' | 'content' | 'sentDate' | 'signedDate' | 'clientSignature' | 'signatureDate' | 'documentUrl' | 'clientName' | 'clientEmail' | 'clientPhone' | 'companyName' | 'companyAddress'> {}

class DmcOpportunityAgreements extends Model<DmcOpportunityAgreementsAttributes, DmcOpportunityAgreementsCreationAttributes> implements DmcOpportunityAgreementsAttributes {
  public id!: number;
  public opportunityId!: number;
  public agreementNumber!: string;
  public agreementType!: string;
  public templateId!: number | null;
  public agreementTitle!: string;
  public title!: string | null;
  public description!: string | null;
  public duration!: string;
  public startDate!: Date;
  public endDate!: Date;
  public amount!: number;
  public totalAmount!: number | null;
  public currency!: string;
  public terms!: string;
  public termsAndConditions!: string | null;
  public specialConditions!: string;
  public content!: string | null;
  public status!: 'draft' | 'generated' | 'sent' | 'signed' | 'uploaded' | 'expired';
  public generatedDate!: Date;
  public sentDate!: Date | null;
  public signedDate!: Date | null;
  public clientSignature!: string | null;
  public signatureDate!: Date | null;
  public documentUrl!: string | null;
  public clientName!: string | null;
  public clientEmail!: string | null;
  public clientPhone!: string | null;
  public companyName!: string | null;
  public companyAddress!: string | null;
  public uploadedToCrm!: boolean;
  public uploadedBy!: number;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcOpportunityAgreements.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'dmcOpportunity' });
    DmcOpportunityAgreements.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
    DmcOpportunityAgreements.belongsTo(models.DmEmployee, { foreignKey: 'uploadedBy', targetKey: 'id', as: 'uploadedEmployee' });
  }
}

DmcOpportunityAgreements.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dmc_opportunities',
        key: 'id'
      }
    },
    agreementNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    agreementType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    agreementTitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    termsAndConditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialConditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'generated', 'sent', 'signed', 'uploaded', 'expired'),
      allowNull: false,
      defaultValue: 'draft'
    },
    generatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    sentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    signedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    clientSignature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    signatureDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    documentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    clientName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clientEmail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    clientPhone: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    companyName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    companyAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uploadedToCrm: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    }
  },
  {
    sequelize,
    modelName: 'DmcOpportunityAgreements',
    tableName: 'dm_opportunity_agreements',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcOpportunityAgreements };
export type { DmcOpportunityAgreementsAttributes, DmcOpportunityAgreementsCreationAttributes };
