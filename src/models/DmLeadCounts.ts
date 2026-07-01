import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeadCountsAttributes {
  id: number;
  branch_id: number;
  emp_id: number;
  lead_count: number;
}

interface DmLeadCountsCreationAttributes extends Optional<DmLeadCountsAttributes, never> {}

class DmLeadCounts extends Model<DmLeadCountsAttributes, DmLeadCountsCreationAttributes> implements DmLeadCountsAttributes {
  public id!: number;
  public branch_id!: number;
  public emp_id!: number;
  public lead_count!: number;

  public static associate(models: any) {
  }
}

DmLeadCounts.init(
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
    modelName: 'DmLeadCounts',
    tableName: 'dm_lead_counts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeadCounts };
export type { DmLeadCountsAttributes, DmLeadCountsCreationAttributes };
