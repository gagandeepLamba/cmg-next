import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCurrencyAttributes {
  id: number;
  country: string;
  currency_code: string;
  rate: number;
  status: number;
  created: Date;
}

interface DmCurrencyCreationAttributes extends Optional<DmCurrencyAttributes, never> {}

class DmCurrency extends Model<DmCurrencyAttributes, DmCurrencyCreationAttributes> implements DmCurrencyAttributes {
  public id!: number;
  public country!: string;
  public currency_code!: string;
  public rate!: number;
  public status!: number;
  public created!: Date;

  public static associate(models: any) {
    DmCurrency.hasMany(models.DmFee, { foreignKey: 'currency', sourceKey: 'id', as: 'dmFees' });
  }
}

DmCurrency.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    currency_code: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    status: {
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
    modelName: 'DmCurrency',
    tableName: 'dm_currency',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCurrency };
export type { DmCurrencyAttributes, DmCurrencyCreationAttributes };
