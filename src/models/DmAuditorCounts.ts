import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAuditorCountsAttributes {
  id: number;
  branch_id: number;
  emp_id: number;
  lead_count: number;
}

interface DmAuditorCountsCreationAttributes extends Optional<DmAuditorCountsAttributes, never> {}

class DmAuditorCounts extends Model<DmAuditorCountsAttributes, DmAuditorCountsCreationAttributes> implements DmAuditorCountsAttributes {
  public id!: number;
  public branch_id!: number;
  public emp_id!: number;
  public lead_count!: number;

  public static associate(models: any) {
  }
}

DmAuditorCounts.init(
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
    modelName: 'DmAuditorCounts',
    tableName: 'dm_auditor_counts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAuditorCounts };
export type { DmAuditorCountsAttributes, DmAuditorCountsCreationAttributes };
