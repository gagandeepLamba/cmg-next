import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmFeeAttributes {
  id: number;
  service: number | null;
  country: number | null;
  branch: number | null;
  currency: number | null;
  upfront: number;
  prof_fee: number;
  firstMonth: number;
  secondMonth: number;
  thirdMonth: number;
  prof_fee_month: number;
  firstStage: number;
  secondStage: number;
  thirdStage: number;
  forthStage: number;
  fifthStage: number;
  prof_fee_stage: number;
  status: number;
}

interface DmFeeCreationAttributes extends Optional<DmFeeAttributes, 'service' | 'country' | 'branch' | 'currency' | 'upfront' | 'prof_fee' | 'firstMonth' | 'secondMonth' | 'thirdMonth' | 'prof_fee_month' | 'firstStage' | 'secondStage' | 'thirdStage' | 'forthStage' | 'prof_fee_stage' | 'status'> {}

class DmFee extends Model<DmFeeAttributes, DmFeeCreationAttributes> implements DmFeeAttributes {
  public id!: number;
  public service!: number | null;
  public country!: number | null;
  public branch!: number | null;
  public currency!: number | null;
  public upfront!: number;
  public prof_fee!: number;
  public firstMonth!: number;
  public secondMonth!: number;
  public thirdMonth!: number;
  public prof_fee_month!: number;
  public firstStage!: number;
  public secondStage!: number;
  public thirdStage!: number;
  public forthStage!: number;
  public fifthStage!: number;
  public prof_fee_stage!: number;
  public status!: number;

  public static associate(models: any) {
    DmFee.belongsTo(models.DmBranch, { foreignKey: 'branch', targetKey: 'id', as: 'dmBranch' });
    DmFee.belongsTo(models.DmCountryProces, { foreignKey: 'country', targetKey: 'id', as: 'dmCountryProces' });
    DmFee.belongsTo(models.DmCurrency, { foreignKey: 'currency', targetKey: 'id', as: 'dmCurrency' });
    DmFee.belongsTo(models.DmService, { foreignKey: 'service', targetKey: 'id', as: 'dmService' });
  }
}

DmFee.init(
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
    upfront: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    prof_fee: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    firstMonth: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    secondMonth: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    thirdMonth: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    prof_fee_month: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
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
    prof_fee_stage: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  {
    sequelize,
    modelName: 'DmFee',
    tableName: 'dm_fee',
    timestamps: false,
    freezeTableName: true,
  });

export { DmFee };
export type { DmFeeAttributes, DmFeeCreationAttributes };
