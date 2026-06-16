import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcAutoReassignmentRunsAttributes {
  id: number;
  processed: number;
  reassigned: number;
  created_at: Date;
}

interface DmcAutoReassignmentRunsCreationAttributes extends Optional<DmcAutoReassignmentRunsAttributes, 'id' | 'processed' | 'reassigned' | 'created_at'> {}

class DmcAutoReassignmentRuns extends Model<DmcAutoReassignmentRunsAttributes, DmcAutoReassignmentRunsCreationAttributes> implements DmcAutoReassignmentRunsAttributes {
  public id!: number;
  public processed!: number;
  public reassigned!: number;
  public created_at!: Date;
}

DmcAutoReassignmentRuns.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    processed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    reassigned: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'DmcAutoReassignmentRuns',
    tableName: 'dmc_auto_reassignment_runs',
    timestamps: false,
    freezeTableName: true,
  }
);

export { DmcAutoReassignmentRuns };
export type { DmcAutoReassignmentRunsAttributes, DmcAutoReassignmentRunsCreationAttributes };
