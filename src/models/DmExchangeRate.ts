import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmExchangeRateAttributes {
  id: number;
  currency_code: string;
  rate_to_aed: number;
  status: number;
  created_at: Date;
  updated_at: Date;
}

interface DmExchangeRateCreationAttributes extends Optional<DmExchangeRateAttributes, 'id' | 'status' | 'created_at' | 'updated_at'> {}

class DmExchangeRate extends Model<DmExchangeRateAttributes, DmExchangeRateCreationAttributes> implements DmExchangeRateAttributes {
  declare id: number;
  declare currency_code: string;
  declare rate_to_aed: number;
  declare status: number;
  declare created_at: Date;
  declare updated_at: Date;

  public static associate(models: any) {
    DmExchangeRate.hasMany(models.DmBranchExchangeRateMap, { foreignKey: 'exchange_rate_id', sourceKey: 'id', as: 'branchMappings' });
  }
}

DmExchangeRate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    currency_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    rate_to_aed: {
      type: DataTypes.DECIMAL(12, 6),
      allowNull: false,
      defaultValue: 1.0
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    modelName: 'DmExchangeRate',
    tableName: 'dm_exchange_rate',
    timestamps: false,
    freezeTableName: true,
  });

export { DmExchangeRate };
export type { DmExchangeRateAttributes, DmExchangeRateCreationAttributes };
