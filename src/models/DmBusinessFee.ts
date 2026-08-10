import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmBusinessFeeAttributes {
  id: number;
  service: number;
  country: number;
  branch: number;
  currency: number;
  stage_name: string;
  stage: number;
  discount: number;
  status: number;
}

interface DmBusinessFeeCreationAttributes extends Optional<DmBusinessFeeAttributes, 'status'> {}

class DmBusinessFee extends Model<DmBusinessFeeAttributes, DmBusinessFeeCreationAttributes> implements DmBusinessFeeAttributes {
  declare id: number;
  declare service: number;
  declare country: number;
  declare branch: number;
  declare currency: number;
  declare stage_name: string;
  declare stage: number;
  declare discount: number;
  declare status: number;

  public static associate(models: any) {
  }
}

DmBusinessFee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    stage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL(10,2),
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
    modelName: 'DmBusinessFee',
    tableName: 'dm_business_fee',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBusinessFee };
export type { DmBusinessFeeAttributes, DmBusinessFeeCreationAttributes };
