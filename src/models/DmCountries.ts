import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCountriesAttributes {
  id: number;
  name: string;
}

interface DmCountriesCreationAttributes extends Optional<DmCountriesAttributes, 'name'> {}

class DmCountries extends Model<DmCountriesAttributes, DmCountriesCreationAttributes> implements DmCountriesAttributes {
  public id!: number;
  public name!: string;

  public static associate(models: any) {
  }
}

DmCountries.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
  },
  {
    sequelize,
    modelName: 'DmCountries',
    tableName: 'dm_countries',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCountries };
export type { DmCountriesAttributes, DmCountriesCreationAttributes };
