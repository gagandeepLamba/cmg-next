import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCountryProcesAttributes {
  id: number;
  name: string;
  status: number;
  sub_counteries: number;
}

interface DmCountryProcesCreationAttributes extends Optional<DmCountryProcesAttributes, 'status'> {}

class DmCountryProces extends Model<DmCountryProcesAttributes, DmCountryProcesCreationAttributes> implements DmCountryProcesAttributes {
  public id!: number;
  public name!: string;
  public status!: number;
  public sub_counteries!: number;

  public static associate(models: any) {
    DmCountryProces.hasMany(models.DmFee, { foreignKey: 'country', sourceKey: 'id', as: 'dmFees' });
    DmCountryProces.hasMany(models.DmCountriesTypeProgram, { foreignKey: 'country', sourceKey: 'id', as: 'countryPrograms' });
  }
}

DmCountryProces.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    sub_counteries: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmCountryProces',
    tableName: 'dm_country_proces',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCountryProces };
export type { DmCountryProcesAttributes, DmCountryProcesCreationAttributes };
