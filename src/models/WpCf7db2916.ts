import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface WpCf7db2916Attributes {
  id: number;
  cf7dbp_status: string;
  your_name: string;
  tel_861: string;
  your_email: string;
  menu_3065: string;
  menu_359: string;
  menu_35926: string;
  menu_55692: string;
  hidden_field_1: string;
  form_date: Date;
}

interface WpCf7db2916CreationAttributes extends Optional<WpCf7db2916Attributes, 'form_date'> {}

class WpCf7db2916 extends Model<WpCf7db2916Attributes, WpCf7db2916CreationAttributes> implements WpCf7db2916Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public your_name!: string;
  public tel_861!: string;
  public your_email!: string;
  public menu_3065!: string;
  public menu_359!: string;
  public menu_35926!: string;
  public menu_55692!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

WpCf7db2916.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cf7dbp_status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    your_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tel_861: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    menu_3065: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    menu_359: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    menu_35926: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    menu_55692: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hidden_field_1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    form_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '\'0000-00-00'
    },
  },
  {
    sequelize,
    modelName: 'WpCf7db2916',
    tableName: 'wp_cf7db_2916',
    timestamps: false,
    freezeTableName: true,
  });

export { WpCf7db2916 };
export type { WpCf7db2916Attributes, WpCf7db2916CreationAttributes };
