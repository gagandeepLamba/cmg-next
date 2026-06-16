import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeadShjCountsAttributes {
  id: number;
  branch_id: number;
  emp_id: number;
  lead_count: number;
}

interface DmLeadShjCountsCreationAttributes extends Optional<DmLeadShjCountsAttributes, never> {}

class DmLeadShjCounts extends Model<DmLeadShjCountsAttributes, DmLeadShjCountsCreationAttributes> implements DmLeadShjCountsAttributes {
  public id!: number;
  public branch_id!: number;
  public emp_id!: number;
  public lead_count!: number;

  public static associate(models: any) {
  }
}

DmLeadShjCounts.init(
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
    modelName: 'DmLeadShjCounts',
    tableName: 'dm_lead_shj_counts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeadShjCounts };
export type { DmLeadShjCountsAttributes, DmLeadShjCountsCreationAttributes };
