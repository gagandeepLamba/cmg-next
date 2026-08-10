import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmHourlyLeadCountsAttributes {
  id: number;
  branch_id: number;
  emp_id: number;
  lead_count: number;
}

interface DmHourlyLeadCountsCreationAttributes extends Optional<DmHourlyLeadCountsAttributes, never> {}

class DmHourlyLeadCounts extends Model<DmHourlyLeadCountsAttributes, DmHourlyLeadCountsCreationAttributes> implements DmHourlyLeadCountsAttributes {
  declare id: number;
  declare branch_id: number;
  declare emp_id: number;
  declare lead_count: number;

  public static associate(models: any) {
  }
}

DmHourlyLeadCounts.init(
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
    modelName: 'DmHourlyLeadCounts',
    tableName: 'dm_hourly_lead_counts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmHourlyLeadCounts };
export type { DmHourlyLeadCountsAttributes, DmHourlyLeadCountsCreationAttributes };
