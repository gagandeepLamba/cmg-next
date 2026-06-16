import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcDiscountApprovalsAttributes {
  id: number;
  leadId: number;
  opportunityId: number | null;
  discountType: 'percentage' | 'fixed' | 'special';
  discountAmount: number;
  originalAmount: number;
  discountedAmount: number;
  currency: string;
  reason: string;
  requestedBy: number;
  approvedBy: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedDate: Date;
  approvedDate: Date | null;
  rejectedDate: Date | null;
  expiryDate: Date | null;
  notes: string | null;
  approvedAt: Date | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcDiscountApprovalsCreationAttributes extends Optional<DmcDiscountApprovalsAttributes, 'id' | 'approvedBy' | 'approvedDate' | 'rejectedDate' | 'expiryDate' | 'notes' | 'approvedAt'> {}

class DmcDiscountApprovals extends Model<DmcDiscountApprovalsAttributes, DmcDiscountApprovalsCreationAttributes> implements DmcDiscountApprovalsAttributes {
  public id!: number;
  public leadId!: number;
  public opportunityId!: number | null;
  public discountType!: 'percentage' | 'fixed' | 'special';
  public discountAmount!: number;
  public originalAmount!: number;
  public discountedAmount!: number;
  public currency!: string;
  public reason!: string;
  public requestedBy!: number;
  public approvedBy!: number | null;
  public status!: 'pending' | 'approved' | 'rejected' | 'expired';
  public requestedDate!: Date;
  public approvedDate!: Date | null;
  public rejectedDate!: Date | null;
  public expiryDate!: Date | null;
  public notes!: string | null;
  public approvedAt!: Date | null;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcDiscountApprovals.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLead' });
    DmcDiscountApprovals.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'dmcOpportunity' });
    DmcDiscountApprovals.belongsTo(models.DmEmployee, { foreignKey: 'requestedBy', targetKey: 'id', as: 'requestedEmployee' });
    DmcDiscountApprovals.belongsTo(models.DmEmployee, { foreignKey: 'approvedBy', targetKey: 'id', as: 'approvedEmployee' });
    DmcDiscountApprovals.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
  }
}

DmcDiscountApprovals.init(
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
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dmc_opportunities',
        key: 'id'
      }
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed', 'special'),
      allowNull: false,
      defaultValue: 'percentage'
    },
    discountAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    originalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    discountedAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    requestedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    approvedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approvedAt: {
      type: DataTypes.DATE,
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
    modelName: 'DmcDiscountApprovals',
    tableName: 'dm_discount_approvals',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcDiscountApprovals };
export type { DmcDiscountApprovalsAttributes, DmcDiscountApprovalsCreationAttributes };
