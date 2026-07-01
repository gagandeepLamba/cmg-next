import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeadLiveChatCountsAttributes {
  id: number;
  branch_id: number;
  emp_id: number;
  lead_count: number;
}

interface DmLeadLiveChatCountsCreationAttributes extends Optional<DmLeadLiveChatCountsAttributes, never> {}

class DmLeadLiveChatCounts extends Model<DmLeadLiveChatCountsAttributes, DmLeadLiveChatCountsCreationAttributes> implements DmLeadLiveChatCountsAttributes {
  public id!: number;
  public branch_id!: number;
  public emp_id!: number;
  public lead_count!: number;

  public static associate(models: any) {
  }
}

DmLeadLiveChatCounts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lead_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmLeadLiveChatCounts',
    tableName: 'dm_lead_live_chat_counts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeadLiveChatCounts };
export type { DmLeadLiveChatCountsAttributes, DmLeadLiveChatCountsCreationAttributes };
