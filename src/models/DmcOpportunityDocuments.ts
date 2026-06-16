import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcOpportunityDocumentsAttributes {
  id: number;
  opportunityId: number;
  documentType: string;
  documentName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired';
  uploadDate: Date;
  verifiedDate: Date | null;
  verifiedBy: number | null;
  expiryDate: Date | null;
  required: boolean;
  notes: string;
  uploadedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcOpportunityDocumentsCreationAttributes extends Optional<DmcOpportunityDocumentsAttributes, 'id' | 'verifiedDate' | 'verifiedBy' | 'expiryDate'> {}

class DmcOpportunityDocuments extends Model<DmcOpportunityDocumentsAttributes, DmcOpportunityDocumentsCreationAttributes> implements DmcOpportunityDocumentsAttributes {
  public id!: number;
  public opportunityId!: number;
  public documentType!: string;
  public documentName!: string;
  public fileName!: string;
  public filePath!: string;
  public fileSize!: number;
  public mimeType!: string;
  public category!: string;
  public status!: 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired';
  public uploadDate!: Date;
  public verifiedDate!: Date | null;
  public verifiedBy!: number | null;
  public expiryDate!: Date | null;
  public required!: boolean;
  public notes!: string;
  public uploadedBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcOpportunityDocuments.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'dmcOpportunity' });
    DmcOpportunityDocuments.belongsTo(models.DmEmployee, { foreignKey: 'uploadedBy', targetKey: 'id', as: 'uploadedEmployee' });
    DmcOpportunityDocuments.belongsTo(models.DmEmployee, { foreignKey: 'verifiedBy', targetKey: 'id', as: 'verifiedEmployee' });
  }
}

DmcOpportunityDocuments.init(
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
    documentType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    documentName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'uploaded', 'verified', 'rejected', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    verifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uploadedBy: {
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
    modelName: 'DmcOpportunityDocuments',
    tableName: 'dmc_opportunity_documents',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcOpportunityDocuments };
export type { DmcOpportunityDocumentsAttributes, DmcOpportunityDocumentsCreationAttributes };
