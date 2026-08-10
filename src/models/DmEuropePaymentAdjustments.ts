import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEuropePaymentAdjustmentsAttributes {
  id: number;
  lead_id: number;
  stage_1: number;
  stage_2: number;
  stage_3: number;
  stage_4: number;
  stage_5: number;
  created_by: number;
  created: Date;
}

interface DmEuropePaymentAdjustmentsCreationAttributes extends Optional<DmEuropePaymentAdjustmentsAttributes, never> {}

class DmEuropePaymentAdjustments extends Model<DmEuropePaymentAdjustmentsAttributes, DmEuropePaymentAdjustmentsCreationAttributes> implements DmEuropePaymentAdjustmentsAttributes {
  declare id: number;
  declare lead_id: number;
  declare stage_1: number;
  declare stage_2: number;
  declare stage_3: number;
  declare stage_4: number;
  declare stage_5: number;
  declare created_by: number;
  declare created: Date;

  public static associate(models: any) {
    DmEuropePaymentAdjustments.belongsTo(models.DmcForumLeads, { foreignKey: 'lead_id', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmEuropePaymentAdjustments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_1: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    stage_2: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    stage_3: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    stage_4: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    stage_5: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEuropePaymentAdjustments',
    tableName: 'dm_europe_payment_adjustments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEuropePaymentAdjustments };
export type { DmEuropePaymentAdjustmentsAttributes, DmEuropePaymentAdjustmentsCreationAttributes };
