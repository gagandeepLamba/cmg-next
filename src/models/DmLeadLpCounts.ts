import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeadLpCountsAttributes {
  id: number;
  branch_id: number;
  emp_id: number;
  lead_count: number;
}

interface DmLeadLpCountsCreationAttributes extends Optional<DmLeadLpCountsAttributes, never> {}

class DmLeadLpCounts extends Model<DmLeadLpCountsAttributes, DmLeadLpCountsCreationAttributes> implements DmLeadLpCountsAttributes {
  public id!: number;
  public branch_id!: number;
  public emp_id!: number;
  public lead_count!: number;

  public static associate(models: any) {
  }
}

DmLeadLpCounts.init(
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
    modelName: 'DmLeadLpCounts',
    tableName: 'dm_lead_lp_counts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeadLpCounts };
export type { DmLeadLpCountsAttributes, DmLeadLpCountsCreationAttributes };
