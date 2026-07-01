import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcAutoReassignmentRulesAttributes {
  id: number;
  rule_name: string;
  description: string | null;
  inactive_hours_threshold: number;
  auto_reassign: boolean;
  reassign_to_role: string;
  reassign_to_branch: number;
  priority_filter: string;
  lead_quality_filter: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface DmcAutoReassignmentRulesCreationAttributes extends Optional<DmcAutoReassignmentRulesAttributes, 'id' | 'description' | 'inactive_hours_threshold' | 'auto_reassign' | 'reassign_to_role' | 'reassign_to_branch' | 'priority_filter' | 'lead_quality_filter' | 'is_active' | 'created_at' | 'updated_at'> {}

class DmcAutoReassignmentRules extends Model<DmcAutoReassignmentRulesAttributes, DmcAutoReassignmentRulesCreationAttributes> implements DmcAutoReassignmentRulesAttributes {
  public id!: number;
  public rule_name!: string;
  public description!: string | null;
  public inactive_hours_threshold!: number;
  public auto_reassign!: boolean;
  public reassign_to_role!: string;
  public reassign_to_branch!: number;
  public priority_filter!: string;
  public lead_quality_filter!: string;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

DmcAutoReassignmentRules.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    rule_name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    inactive_hours_threshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 6 },
    auto_reassign: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    reassign_to_role: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'available' },
    reassign_to_branch: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    priority_filter: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
    lead_quality_filter: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'DmcAutoReassignmentRules',
    tableName: 'dmc_auto_reassignment_rules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
  }
);

export { DmcAutoReassignmentRules };
export type { DmcAutoReassignmentRulesAttributes, DmcAutoReassignmentRulesCreationAttributes };
