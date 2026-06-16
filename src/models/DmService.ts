import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmServiceAttributes {
  id: number;
  name: string;
  status: number;
  flag: string | null;
  slogan_logo: string | null;
}

interface DmServiceCreationAttributes extends Optional<DmServiceAttributes, 'status' | 'flag' | 'slogan_logo'> {}

class DmService extends Model<DmServiceAttributes, DmServiceCreationAttributes> implements DmServiceAttributes {
  public id!: number;
  public name!: string;
  public status!: number;
  public flag!: string | null;
  public slogan_logo!: string | null;

  public static associate(models: any) {
    DmService.hasMany(models.DmFee, { foreignKey: 'service', sourceKey: 'id', as: 'dmFees' });
    DmService.hasMany(models.DmCountriesTypeProgram, { foreignKey: 'program', sourceKey: 'id', as: 'countryPrograms' });
  }
}

DmService.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    flag: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    slogan_logo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmService',
    tableName: 'dm_service',
    timestamps: false,
    freezeTableName: true,
  });

export { DmService };
export type { DmServiceAttributes, DmServiceCreationAttributes };
