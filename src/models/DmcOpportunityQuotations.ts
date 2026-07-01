import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcOpportunityQuotationsAttributes {
  id: number;
  opportunityId: number;
  quotationNumber: string;
  version: number;
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  terms: string;
  notes: string;
  sentDate: Date | null;
  acceptedDate: Date | null;
  rejectedDate: Date | null;
  rejectedReason: string | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcOpportunityQuotationsCreationAttributes extends Optional<DmcOpportunityQuotationsAttributes, 'id' | 'sentDate' | 'acceptedDate' | 'rejectedDate' | 'rejectedReason'> {}

class DmcOpportunityQuotations extends Model<DmcOpportunityQuotationsAttributes, DmcOpportunityQuotationsCreationAttributes> implements DmcOpportunityQuotationsAttributes {
  public id!: number;
  public opportunityId!: number;
  public quotationNumber!: string;
  public version!: number;
  public validUntil!: Date;
  public status!: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  public subtotal!: number;
  public discount!: number;
  public discountType!: 'percentage' | 'fixed';
  public tax!: number;
  public taxRate!: number;
  public total!: number;
  public currency!: string;
  public terms!: string;
  public notes!: string;
  public sentDate!: Date | null;
  public acceptedDate!: Date | null;
  public rejectedDate!: Date | null;
  public rejectedReason!: string | null;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcOpportunityQuotations.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'dmcOpportunity' });
    DmcOpportunityQuotations.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
    DmcOpportunityQuotations.hasMany(models.DmcQuotationItems, { foreignKey: 'quotationId', sourceKey: 'id', as: 'quotationItems' });
  }
}

DmcOpportunityQuotations.init(
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
    quotationNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
      allowNull: false,
      defaultValue: 'draft'
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      defaultValue: 'percentage'
    },
    tax: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
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
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    acceptedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedReason: {
      type: DataTypes.TEXT,
      allowNull: true
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
    modelName: 'DmcOpportunityQuotations',
    tableName: 'dmc_opportunity_quotations',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcOpportunityQuotations };
export type { DmcOpportunityQuotationsAttributes, DmcOpportunityQuotationsCreationAttributes };
