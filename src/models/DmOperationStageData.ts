import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmOperationStageDataAttributes {
  id: number;
  module: string;
  leadId: number;
  opportunityId: number | null;
  stage: string;
  stageData: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DmOperationStageDataCreationAttributes extends Optional<DmOperationStageDataAttributes, 'id' | 'opportunityId' | 'stageData' | 'createdAt' | 'updatedAt'> {}

class DmOperationStageData extends Model<DmOperationStageDataAttributes, DmOperationStageDataCreationAttributes> implements DmOperationStageDataAttributes {
  declare id: number;
  declare module: string;
  declare leadId: number;
  declare opportunityId: number | null;
  declare stage: string;
  declare stageData: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  public static associate(models: any) {
    DmOperationStageData.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' });
    DmOperationStageData.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'opportunity' });
  }
}

DmOperationStageData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    module: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stage: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    stageData: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      defaultValue: '{}',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'DmOperationStageData',
    tableName: 'dm_operation_stage_data',
    timestamps: true,
    freezeTableName: true,
  }
);

export { DmOperationStageData };
export type { DmOperationStageDataAttributes, DmOperationStageDataCreationAttributes };
