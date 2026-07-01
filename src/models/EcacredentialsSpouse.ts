import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EcacredentialsSpouseAttributes {
  id: number;
  leadid: number | null;
  ecauid: string | null;
  ecausrpsswrd: string | null;
  regemail: string | null;
  regpsswrd: string | null;
  secq: string | null;
  seca: string | null;
}

interface EcacredentialsSpouseCreationAttributes extends Optional<EcacredentialsSpouseAttributes, 'leadid' | 'ecauid' | 'ecausrpsswrd' | 'regemail' | 'regpsswrd' | 'secq' | 'seca'> {}

class EcacredentialsSpouse extends Model<EcacredentialsSpouseAttributes, EcacredentialsSpouseCreationAttributes> implements EcacredentialsSpouseAttributes {
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

EcacredentialsSpouse.init(
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
    modelName: 'EcacredentialsSpouse',
    tableName: 'ecacredentials_spouse',
    timestamps: false,
    freezeTableName: true,
  });

export { EcacredentialsSpouse };
export type { EcacredentialsSpouseAttributes, EcacredentialsSpouseCreationAttributes };
