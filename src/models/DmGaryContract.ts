import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmGaryContractAttributes {
  id: number;
  leadid: number | null;
  contract: string;
  contract_signed: string;
}

interface DmGaryContractCreationAttributes extends Optional<DmGaryContractAttributes, 'leadid'> {}

class DmGaryContract extends Model<DmGaryContractAttributes, DmGaryContractCreationAttributes> implements DmGaryContractAttributes {
  public id!: number;
  public leadid!: number | null;
  public contract!: string;
  public contract_signed!: string;

  public static associate(models: any) {
  }
}

DmGaryContract.init(
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
    contract: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    contract_signed: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmGaryContract',
    tableName: 'dm_gary_contract',
    timestamps: false,
    freezeTableName: true,
  });

export { DmGaryContract };
export type { DmGaryContractAttributes, DmGaryContractCreationAttributes };
