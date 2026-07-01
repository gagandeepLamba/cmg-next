import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCountriesTypeProgramAttributes {
  id: number;
  country: number;
  type: number;
  program: number;
  created: Date;
  created_by: number;
}

interface DmCountriesTypeProgramCreationAttributes extends Optional<DmCountriesTypeProgramAttributes, never> {}

class DmCountriesTypeProgram extends Model<DmCountriesTypeProgramAttributes, DmCountriesTypeProgramCreationAttributes> implements DmCountriesTypeProgramAttributes {
  public id!: number;
  public country!: number;
  public type!: number;
  public program!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
    DmCountriesTypeProgram.belongsTo(models.DmCountryProces, { foreignKey: 'country', targetKey: 'id', as: 'countryDetails' });
    DmCountriesTypeProgram.belongsTo(models.DmService, { foreignKey: 'program', targetKey: 'id', as: 'programDetails' });
    DmCountriesTypeProgram.belongsTo(models.DmProgramType, { foreignKey: 'type', targetKey: 'id', as: 'typeDetails' });
  }
}

DmCountriesTypeProgram.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    program: {
      type: DataTypes.INTEGER,
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
    modelName: 'DmCountriesTypeProgram',
    tableName: 'dm_countries_type_program',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCountriesTypeProgram };
export type { DmCountriesTypeProgramAttributes, DmCountriesTypeProgramCreationAttributes };
