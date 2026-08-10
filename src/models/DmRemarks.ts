import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmRemarksAttributes {
  id: number;
  leadId: number;
  action: string;
  remark: string;
  previousValue: string | null;
  newValue: string | null;
  actorId: number | null;
  actorRole: string | null;
  createdAt: Date;
}

interface DmRemarksCreationAttributes extends Optional<DmRemarksAttributes, 'id' | 'previousValue' | 'newValue' | 'actorId' | 'actorRole' | 'createdAt'> {}

class DmRemarks extends Model<DmRemarksAttributes, DmRemarksCreationAttributes> implements DmRemarksAttributes {
  declare id: number;
  declare leadId: number;
  declare action: string;
  declare remark: string;
  declare previousValue: string | null;
  declare newValue: string | null;
  declare actorId: number | null;
  declare actorRole: string | null;
  declare createdAt: Date;

  public static associate(models: any) {
    DmRemarks.belongsTo(models.DmcForumLeads, { foreignKey: 'lead_id', targetKey: 'id', as: 'lead' });
    DmRemarks.belongsTo(models.DmEmployee, { foreignKey: 'actor_id', targetKey: 'id', as: 'actor' });
  }
}

DmRemarks.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: 'id' },
    leadId: { type: DataTypes.INTEGER, allowNull: false, field: 'lead_id', references: { model: 'dmc_forum_leads', key: 'id' } },
    action: { type: DataTypes.STRING(50), allowNull: false, field: 'action' },
    remark: { type: DataTypes.TEXT, allowNull: false, field: 'remark' },
    previousValue: { type: DataTypes.STRING(255), allowNull: true, field: 'previous_value' },
    newValue: { type: DataTypes.STRING(255), allowNull: true, field: 'new_value' },
    actorId: { type: DataTypes.INTEGER, allowNull: true, field: 'actor_id', references: { model: 'dm_employee', key: 'id' } },
    actorRole: { type: DataTypes.STRING(80), allowNull: true, field: 'actor_role' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
  },
  {
    sequelize,
    modelName: 'DmRemarks',
    tableName: 'dm_remarks',
    timestamps: false,
    freezeTableName: true,
  }
);

export { DmRemarks };
export type { DmRemarksAttributes, DmRemarksCreationAttributes };
