import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EcacredentialsSpouseOldAttributes {
  id: number;
  agreeNo: number | null;
  ecauid: string | null;
  ecausrpsswrd: string | null;
  regemail: string | null;
  regpsswrd: string | null;
  secq: string | null;
  seca: string | null;
}

interface EcacredentialsSpouseOldCreationAttributes extends Optional<EcacredentialsSpouseOldAttributes, 'agreeNo' | 'ecauid' | 'ecausrpsswrd' | 'regemail' | 'regpsswrd' | 'secq' | 'seca'> {}

class EcacredentialsSpouseOld extends Model<EcacredentialsSpouseOldAttributes, EcacredentialsSpouseOldCreationAttributes> implements EcacredentialsSpouseOldAttributes {
  public id!: number;
  public agreeNo!: number | null;
  public ecauid!: string | null;
  public ecausrpsswrd!: string | null;
  public regemail!: string | null;
  public regpsswrd!: string | null;
  public secq!: string | null;
  public seca!: string | null;

  public static associate(models: any) {
  }
}

EcacredentialsSpouseOld.init(
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
    modelName: 'EcacredentialsSpouseOld',
    tableName: 'ecacredentials_spouse_old',
    timestamps: false,
    freezeTableName: true,
  });

export { EcacredentialsSpouseOld };
export type { EcacredentialsSpouseOldAttributes, EcacredentialsSpouseOldCreationAttributes };
