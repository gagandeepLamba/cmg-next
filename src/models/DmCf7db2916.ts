import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCf7db2916Attributes {
  id: number;
  cf7dbp_status: string;
  your_name: string;
  phonetext_512: string;
  your_email: string;
  menu_3065: string;
  menu_359: string;
  menu_35926: string;
  menu_55692: string;
  hidden_field_1: string;
  form_date: Date;
}

interface DmCf7db2916CreationAttributes extends Optional<DmCf7db2916Attributes, 'form_date'> {}

class DmCf7db2916 extends Model<DmCf7db2916Attributes, DmCf7db2916CreationAttributes> implements DmCf7db2916Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public your_name!: string;
  public phonetext_512!: string;
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

DmCf7db2916.init(
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
    phonetext_512: {
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
    modelName: 'DmCf7db2916',
    tableName: 'dm_cf7db_2916',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCf7db2916 };
export type { DmCf7db2916Attributes, DmCf7db2916CreationAttributes };
