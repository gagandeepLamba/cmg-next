import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmpStocksAttributes {
  id: number;
  branch: number;
  msisdn: string;
  type: number;
  model: string;
  model_number: string;
  serial_number: string;
  description: string;
  charger: number;
  battery: number;
  mouse: number;
  keyboard: number;
  created: Date;
  status: number;
  created_by: number;
  dop: Date;
}

interface DmEmpStocksCreationAttributes extends Optional<DmEmpStocksAttributes, never> {}

class DmEmpStocks extends Model<DmEmpStocksAttributes, DmEmpStocksCreationAttributes> implements DmEmpStocksAttributes {
  declare id: number;
  declare branch: number;
  declare msisdn: string;
  declare type: number;
  declare model: string;
  declare model_number: string;
  declare serial_number: string;
  declare description: string;
  declare charger: number;
  declare battery: number;
  declare mouse: number;
  declare keyboard: number;
  declare created: Date;
  declare status: number;
  declare created_by: number;
  declare dop: Date;

  public static associate(models: any) {
  }
}

DmEmpStocks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    msisdn: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    model_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    serial_number: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    charger: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    battery: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mouse: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    keyboard: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dop: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmpStocks',
    tableName: 'dm_emp_stocks',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmpStocks };
export type { DmEmpStocksAttributes, DmEmpStocksCreationAttributes };
