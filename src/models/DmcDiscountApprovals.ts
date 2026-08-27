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
  // Set when a counselor re-applies to correct a wrong amount/approval - the
  // old row is soft-deleted (is_deleted=1, superseded_by pointing at the
  // replacement) immediately on re-apply, never shown in any active list.
  isDeleted: boolean;
  supersededBy: number | null;
}

interface DmcDiscountApprovalsCreationAttributes extends Optional<DmcDiscountApprovalsAttributes, 'id' | 'approvedBy' | 'approvedDate' | 'rejectedDate' | 'expiryDate' | 'notes' | 'approvedAt' | 'isDeleted' | 'supersededBy'> {}

class DmcDiscountApprovals extends Model<DmcDiscountApprovalsAttributes, DmcDiscountApprovalsCreationAttributes> implements DmcDiscountApprovalsAttributes {
  declare id: number;
  declare leadId: number;
  declare opportunityId: number | null;
  declare discountType: 'percentage' | 'fixed' | 'special';
  declare discountAmount: number;
  declare originalAmount: number;
  declare discountedAmount: number;
  declare currency: string;
  declare reason: string;
  declare requestedBy: number;
  declare approvedBy: number | null;
  declare status: 'pending' | 'approved' | 'rejected' | 'expired';
  declare requestedDate: Date;
  declare approvedDate: Date | null;
  declare rejectedDate: Date | null;
  declare expiryDate: Date | null;
  declare notes: string | null;
  declare approvedAt: Date | null;
  declare createdBy: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare isDeleted: boolean;
  declare supersededBy: number | null;

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
    },
    isDeleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      field: 'is_deleted',
    },
    supersededBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'superseded_by',
    },
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
