import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLmiaPaymentAdjustmentsAttributes {
  id: number;
  lead_Id: number;
  stage_1: number;
  stage_2: number;
  stage_3: number;
  stage_4: number;
  stage_5: number;
  created: Date;
  created_by: number;
}

interface DmLmiaPaymentAdjustmentsCreationAttributes extends Optional<DmLmiaPaymentAdjustmentsAttributes, never> {}

class DmLmiaPaymentAdjustments extends Model<DmLmiaPaymentAdjustmentsAttributes, DmLmiaPaymentAdjustmentsCreationAttributes> implements DmLmiaPaymentAdjustmentsAttributes {
  declare id: number;
  declare lead_Id: number;
  declare stage_1: number;
  declare stage_2: number;
  declare stage_3: number;
  declare stage_4: number;
  declare stage_5: number;
  declare created: Date;
  declare created_by: number;

  public static associate(models: any) {
  }
}

DmLmiaPaymentAdjustments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_Id: {
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
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmLmiaPaymentAdjustments',
    tableName: 'dm_lmia_payment_adjustments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLmiaPaymentAdjustments };
export type { DmLmiaPaymentAdjustmentsAttributes, DmLmiaPaymentAdjustmentsCreationAttributes };
