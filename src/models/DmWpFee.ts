import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmWpFeeAttributes {
  id: number;
  service: number | null;
  country: number | null;
  branch: number | null;
  currency: number | null;
  firstStage: number;
  secondStage: number;
  thirdStage: number;
  forthStage: number;
  fifthStage: number;
  status: number;
}

interface DmWpFeeCreationAttributes extends Optional<DmWpFeeAttributes, 'service' | 'country' | 'branch' | 'currency' | 'firstStage' | 'secondStage' | 'thirdStage' | 'forthStage' | 'status'> {}

class DmWpFee extends Model<DmWpFeeAttributes, DmWpFeeCreationAttributes> implements DmWpFeeAttributes {
  public id!: number;
  public service!: number | null;
  public country!: number | null;
  public branch!: number | null;
  public currency!: number | null;
  public firstStage!: number;
  public secondStage!: number;
  public thirdStage!: number;
  public forthStage!: number;
  public fifthStage!: number;
  public status!: number;

  public static associate(models: any) {
  }
}

DmWpFee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    currency: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    firstStage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    secondStage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    thirdStage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    forthStage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    fifthStage: {
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
    modelName: 'DmWpFee',
    tableName: 'dm_wp_fee',
    timestamps: false,
    freezeTableName: true,
  });

export { DmWpFee };
export type { DmWpFeeAttributes, DmWpFeeCreationAttributes };
