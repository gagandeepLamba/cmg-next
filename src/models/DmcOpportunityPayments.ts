import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcOpportunityPaymentsAttributes {
  id: number;
  opportunityId: number;
  paymentNumber: string;
  receiptNumber: string | null;
  paymentStructure: 'full' | 'installment' | 'milestone';
  paymentType: string | null;
  totalAmount: number;
  amount: number | null;
  paidAmount: number;
  remainingBalance: number;
  balanceAmount: number | null;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  paymentDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'paid' | 'failed' | 'refunded';
  dueDate: Date;
  installmentNumber: number | null;
  totalInstallments: number | null;
  milestoneName: string | null;
  gateway: string;
  gatewayTransactionId: string | null;
  receiptUrl: string | null;
  description: string | null;
  receiptType: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  clientAddress: string | null;
  serviceName: string | null;
  branchName: string | null;
  consultantName: string | null;
  taxAmount: number | null;
  discountAmount: number | null;
  notes: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcOpportunityPaymentsCreationAttributes extends Optional<DmcOpportunityPaymentsAttributes, 'id' | 'receiptNumber' | 'paymentType' | 'amount' | 'balanceAmount' | 'transactionId' | 'installmentNumber' | 'totalInstallments' | 'milestoneName' | 'gateway' | 'gatewayTransactionId' | 'receiptUrl' | 'description' | 'receiptType' | 'clientName' | 'clientEmail' | 'clientPhone' | 'clientAddress' | 'serviceName' | 'branchName' | 'consultantName' | 'taxAmount' | 'discountAmount' | 'notes'> {}

class DmcOpportunityPayments extends Model<DmcOpportunityPaymentsAttributes, DmcOpportunityPaymentsCreationAttributes> implements DmcOpportunityPaymentsAttributes {
  public id!: number;
  public opportunityId!: number;
  public paymentNumber!: string;
  public receiptNumber!: string | null;
  public paymentStructure!: 'full' | 'installment' | 'milestone';
  public paymentType!: string | null;
  public totalAmount!: number;
  public amount!: number | null;
  public paidAmount!: number;
  public remainingBalance!: number;
  public balanceAmount!: number | null;
  public currency!: string;
  public paymentMethod!: string;
  public transactionId!: string;
  public paymentDate!: Date;
  public status!: 'pending' | 'processing' | 'completed' | 'paid' | 'failed' | 'refunded';
  public dueDate!: Date;
  public installmentNumber!: number | null;
  public totalInstallments!: number | null;
  public milestoneName!: string | null;
  public gateway!: string;
  public gatewayTransactionId!: string | null;
  public receiptUrl!: string | null;
  public description!: string | null;
  public receiptType!: string | null;
  public clientName!: string | null;
  public clientEmail!: string | null;
  public clientPhone!: string | null;
  public clientAddress!: string | null;
  public serviceName!: string | null;
  public branchName!: string | null;
  public consultantName!: string | null;
  public taxAmount!: number | null;
  public discountAmount!: number | null;
  public notes!: string;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcOpportunityPayments.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'dmcOpportunity' });
    DmcOpportunityPayments.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
  }
}

DmcOpportunityPayments.init(
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
    paymentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    paymentStructure: {
      type: DataTypes.ENUM('full', 'installment', 'milestone'),
      allowNull: false,
      defaultValue: 'full'
    },
    paymentType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    totalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    paidAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    remainingBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    balanceAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    installmentNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    totalInstallments: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    milestoneName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gateway: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gatewayTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    receiptUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receiptType: {
      type: DataTypes.STRING(50),
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
    clientAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    serviceName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    branchName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    consultantName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    taxAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0
    },
    notes: {
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
    modelName: 'DmcOpportunityPayments',
    tableName: 'dm_opportunity_payments',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcOpportunityPayments };
export type { DmcOpportunityPaymentsAttributes, DmcOpportunityPaymentsCreationAttributes };
