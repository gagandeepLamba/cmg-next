import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcQuotationItemsAttributes {
  id: number;
  quotationId: number;
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  category: string;
  serviceType: string;
  duration: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcQuotationItemsCreationAttributes extends Optional<DmcQuotationItemsAttributes, 'id'> {}

class DmcQuotationItems extends Model<DmcQuotationItemsAttributes, DmcQuotationItemsCreationAttributes> implements DmcQuotationItemsAttributes {
  public id!: number;
  public quotationId!: number;
  public itemType!: string;
  public description!: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public currency!: string;
  public category!: string;
  public serviceType!: string;
  public duration!: string;
  public notes!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcQuotationItems.belongsTo(models.DmcOpportunityQuotations, { foreignKey: 'quotationId', targetKey: 'id', as: 'dmcOpportunityQuotation' });
  }
}

DmcQuotationItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    quotationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dmc_opportunity_quotations',
        key: 'id'
      }
    },
    itemType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1
    },
    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    totalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    serviceType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
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
    modelName: 'DmcQuotationItems',
    tableName: 'dmc_quotation_items',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcQuotationItems };
export type { DmcQuotationItemsAttributes, DmcQuotationItemsCreationAttributes };
