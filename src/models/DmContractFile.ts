import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmContractFileAttributes {
  id: number;
  country: number;
  service: number;
  file: string;
  status: number;
}

interface DmContractFileCreationAttributes extends Optional<DmContractFileAttributes, 'status'> {}

class DmContractFile extends Model<DmContractFileAttributes, DmContractFileCreationAttributes> implements DmContractFileAttributes {
  public id!: number;
  public country!: number;
  public service!: number;
  public file!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmContractFile.init(
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
    service: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    file: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  {
    sequelize,
    modelName: 'DmContractFile',
    tableName: 'dm_contract_file',
    timestamps: false,
    freezeTableName: true,
  });

export { DmContractFile };
export type { DmContractFileAttributes, DmContractFileCreationAttributes };
