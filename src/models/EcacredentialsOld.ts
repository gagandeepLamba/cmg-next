import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EcacredentialsOldAttributes {
  id: number;
  agreeNo: number | null;
  ecauid: string | null;
  ecausrpsswrd: string | null;
  regemail: string | null;
  regpsswrd: string | null;
  secq: string | null;
  seca: string | null;
}

interface EcacredentialsOldCreationAttributes extends Optional<EcacredentialsOldAttributes, 'agreeNo' | 'ecauid' | 'ecausrpsswrd' | 'regemail' | 'regpsswrd' | 'secq' | 'seca'> {}

class EcacredentialsOld extends Model<EcacredentialsOldAttributes, EcacredentialsOldCreationAttributes> implements EcacredentialsOldAttributes {
  declare id: number;
  declare agreeNo: number | null;
  declare ecauid: string | null;
  declare ecausrpsswrd: string | null;
  declare regemail: string | null;
  declare regpsswrd: string | null;
  declare secq: string | null;
  declare seca: string | null;

  public static associate(models: any) {
  }
}

EcacredentialsOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ecauid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ecausrpsswrd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    regemail: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    regpsswrd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    secq: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    seca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'EcacredentialsOld',
    tableName: 'ecacredentials_old',
    timestamps: false,
    freezeTableName: true,
  });

export { EcacredentialsOld };
export type { EcacredentialsOldAttributes, EcacredentialsOldCreationAttributes };
