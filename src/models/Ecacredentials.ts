import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EcacredentialsAttributes {
  id: number;
  leadid: number | null;
  ecauid: string | null;
  ecausrpsswrd: string | null;
  regemail: string | null;
  regpsswrd: string | null;
  secq: string | null;
  seca: string | null;
}

interface EcacredentialsCreationAttributes extends Optional<EcacredentialsAttributes, 'leadid' | 'ecauid' | 'ecausrpsswrd' | 'regemail' | 'regpsswrd' | 'secq' | 'seca'> {}

class Ecacredentials extends Model<EcacredentialsAttributes, EcacredentialsCreationAttributes> implements EcacredentialsAttributes {
  public id!: number;
  public leadid!: number | null;
  public ecauid!: string | null;
  public ecausrpsswrd!: string | null;
  public regemail!: string | null;
  public regpsswrd!: string | null;
  public secq!: string | null;
  public seca!: string | null;

  public static associate(models: any) {
  }
}

Ecacredentials.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
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
    modelName: 'Ecacredentials',
    tableName: 'ecacredentials',
    timestamps: false,
    freezeTableName: true,
  });

export { Ecacredentials };
export type { EcacredentialsAttributes, EcacredentialsCreationAttributes };
