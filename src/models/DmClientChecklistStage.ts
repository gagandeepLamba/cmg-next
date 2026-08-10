import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmClientChecklistStageAttributes {
  stageId: string;
  opportunityId: number;
  leadId: number;
  productType: string;
  stageKey: string;
  stageLabel: string;
  sequence: number;
  status: 'not_started' | 'in_progress' | 'completed';
  statusNote: string | null;
  completedAt: Date | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DmClientChecklistStageCreationAttributes
  extends Optional<DmClientChecklistStageAttributes, 'statusNote' | 'completedAt' | 'updatedBy' | 'createdAt' | 'updatedAt'> {}

class DmClientChecklistStage
  extends Model<DmClientChecklistStageAttributes, DmClientChecklistStageCreationAttributes>
  implements DmClientChecklistStageAttributes
{
  declare stageId: string;
  declare opportunityId: number;
  declare leadId: number;
  declare productType: string;
  declare stageKey: string;
  declare stageLabel: string;
  declare sequence: number;
  declare status: 'not_started' | 'in_progress' | 'completed';
  declare statusNote: string | null;
  declare completedAt: Date | null;
  declare updatedBy: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  public static associate(models: any) {
    DmClientChecklistStage.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' });
    DmClientChecklistStage.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'opportunity' });
  }
}

DmClientChecklistStage.init(
  {
    stageId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      field: 'stage_id',
    },
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'opportunity_id',
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'lead_id',
    },
    productType: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'product_type',
    },
    stageKey: {
      type: DataTypes.STRING(60),
      allowNull: false,
      field: 'stage_key',
    },
    stageLabel: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'stage_label',
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'not_started',
    },
    statusNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'status_note',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
    updatedBy: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      field: 'updated_by',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'DmClientChecklistStage',
    tableName: 'dm_client_checklist_stages',
    timestamps: true,
    freezeTableName: true,
  }
);

export { DmClientChecklistStage };
export type { DmClientChecklistStageAttributes, DmClientChecklistStageCreationAttributes };
