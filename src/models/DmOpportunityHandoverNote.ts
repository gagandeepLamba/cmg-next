import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmOpportunityHandoverNoteAttributes {
  id: number;
  leadId: number;
  opportunityId: number | null;
  counselorId: number | null;
  conversationSummary: string;
  clientCommitments: string | null;
  nextAction: string | null;
  createdAt: Date;
}

interface DmOpportunityHandoverNoteCreationAttributes extends Optional<DmOpportunityHandoverNoteAttributes, 'id' | 'opportunityId' | 'counselorId' | 'clientCommitments' | 'nextAction' | 'createdAt'> {}

class DmOpportunityHandoverNote extends Model<DmOpportunityHandoverNoteAttributes, DmOpportunityHandoverNoteCreationAttributes> implements DmOpportunityHandoverNoteAttributes {
  declare id: number;
  declare leadId: number;
  declare opportunityId: number | null;
  declare counselorId: number | null;
  declare conversationSummary: string;
  declare clientCommitments: string | null;
  declare nextAction: string | null;
  declare createdAt: Date;

  public static associate(models: any) {
    DmOpportunityHandoverNote.belongsTo(models.DmcForumLeads, { foreignKey: 'lead_id', targetKey: 'id', as: 'lead' });
    DmOpportunityHandoverNote.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunity_id', targetKey: 'id', as: 'opportunity' });
    DmOpportunityHandoverNote.belongsTo(models.DmEmployee, { foreignKey: 'counselor_id', targetKey: 'id', as: 'counselor' });
  }
}

DmOpportunityHandoverNote.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, field: 'id' },
    leadId: { type: DataTypes.INTEGER, allowNull: false, field: 'lead_id', references: { model: 'dmc_forum_leads', key: 'id' } },
    opportunityId: { type: DataTypes.INTEGER, allowNull: true, field: 'opportunity_id', references: { model: 'dmc_opportunities', key: 'id' } },
    counselorId: { type: DataTypes.INTEGER, allowNull: true, field: 'counselor_id', references: { model: 'dm_employee', key: 'id' } },
    conversationSummary: { type: DataTypes.TEXT, allowNull: false, field: 'conversation_summary' },
    clientCommitments: { type: DataTypes.TEXT, allowNull: true, field: 'client_commitments' },
    nextAction: { type: DataTypes.TEXT, allowNull: true, field: 'next_action' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
  },
  {
    sequelize,
    modelName: 'DmOpportunityHandoverNote',
    tableName: 'dm_opportunity_handover_notes',
    timestamps: false,
    freezeTableName: true,
  }
);

export { DmOpportunityHandoverNote };
export type { DmOpportunityHandoverNoteAttributes, DmOpportunityHandoverNoteCreationAttributes };
