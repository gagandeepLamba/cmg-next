import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmBranchExchangeRateMapAttributes {
  id: number;
  branch_id: number;
  exchange_rate_id: number;
  updated_at: Date;
}

interface DmBranchExchangeRateMapCreationAttributes extends Optional<DmBranchExchangeRateMapAttributes, 'id' | 'updated_at'> {}

class DmBranchExchangeRateMap extends Model<DmBranchExchangeRateMapAttributes, DmBranchExchangeRateMapCreationAttributes> implements DmBranchExchangeRateMapAttributes {
  declare id: number;
  declare branch_id: number;
  declare exchange_rate_id: number;
  declare updated_at: Date;

  public static associate(models: any) {
    DmBranchExchangeRateMap.belongsTo(models.DmBranch, { foreignKey: 'branch_id', targetKey: 'id', as: 'branch' });
    DmBranchExchangeRateMap.belongsTo(models.DmExchangeRate, { foreignKey: 'exchange_rate_id', targetKey: 'id', as: 'exchangeRate' });
  }
}

DmBranchExchangeRateMap.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    exchange_rate_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    modelName: 'DmBranchExchangeRateMap',
    tableName: 'dm_branch_exchange_rate_map',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBranchExchangeRateMap };
export type { DmBranchExchangeRateMapAttributes, DmBranchExchangeRateMapCreationAttributes };
