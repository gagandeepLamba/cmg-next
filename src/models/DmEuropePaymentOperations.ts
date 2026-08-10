import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEuropePaymentOperationsAttributes {
  id: number;
  lead_id: number;
  stage_1: number;
  stage_2: number;
  stage_3: number;
  stage_4: number;
  stage_5: number;
  stage_status_1: string;
  stage_status_2: string;
  stage_status_3: string;
  stage_status_4: string;
  stage_status_5: string;
  created_by: number;
  created: Date;
}

interface DmEuropePaymentOperationsCreationAttributes extends Optional<DmEuropePaymentOperationsAttributes, never> {}

class DmEuropePaymentOperations extends Model<DmEuropePaymentOperationsAttributes, DmEuropePaymentOperationsCreationAttributes> implements DmEuropePaymentOperationsAttributes {
  declare id: number;
  declare lead_id: number;
  declare stage_1: number;
  declare stage_2: number;
  declare stage_3: number;
  declare stage_4: number;
  declare stage_5: number;
  declare stage_status_1: string;
  declare stage_status_2: string;
  declare stage_status_3: string;
  declare stage_status_4: string;
  declare stage_status_5: string;
  declare created_by: number;
  declare created: Date;

  public static associate(models: any) {
  }
}

DmEuropePaymentOperations.init(
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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_3: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_4: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_5: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_status_1: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stage_status_2: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stage_status_3: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stage_status_4: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stage_status_5: {
      type: DataTypes.STRING(100),
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
    modelName: 'DmEuropePaymentOperations',
    tableName: 'dm_europe_payment_operations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEuropePaymentOperations };
export type { DmEuropePaymentOperationsAttributes, DmEuropePaymentOperationsCreationAttributes };
