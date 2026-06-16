import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsFeeAttributes {
  id: number;
  lead: number;
  amount: number;
  taxAmt: number;
  payDate: Date;
  paidAmt: number;
  paidDate: Date;
  profAmt: number;
  status: number;
}

type DmcForumLeadsFeeCreationAttributes = Optional<DmcForumLeadsFeeAttributes, 'id' | 'status'>;

class DmcForumLeadsFee extends Model<DmcForumLeadsFeeAttributes, DmcForumLeadsFeeCreationAttributes> implements DmcForumLeadsFeeAttributes {
  public id!: number;
  public lead!: number;
  public amount!: number;
  public taxAmt!: number;
  public payDate!: Date;
  public paidAmt!: number;
  public paidDate!: Date;
  public profAmt!: number;
  public status!: number;

  public static associate(models: any) {
    DmcForumLeadsFee.belongsTo(models.DmcForumLeads, { foreignKey: 'lead', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmcForumLeadsFee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    taxAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    paidAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    profAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsFee',
    tableName: 'dmc_forum_leads_fee',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsFee };
export type { DmcForumLeadsFeeAttributes, DmcForumLeadsFeeCreationAttributes };
