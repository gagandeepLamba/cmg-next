import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCf7db3848Attributes {
  id: number;
  cf7dbp_status: string;
  your_name: string;
  phonetext_737: string;
  your_email: string;
  menu_3065: string;
  menu_359: string;
  menu_35926: string;
  menu_55692: string;
  hidden_field_1: string;
  form_date: Date;
}

interface DmCf7db3848CreationAttributes extends Optional<DmCf7db3848Attributes, 'form_date'> {}

class DmCf7db3848 extends Model<DmCf7db3848Attributes, DmCf7db3848CreationAttributes> implements DmCf7db3848Attributes {
  declare id: number;
  declare cf7dbp_status: string;
  declare your_name: string;
  declare phonetext_737: string;
  declare your_email: string;
  declare menu_3065: string;
  declare menu_359: string;
  declare menu_35926: string;
  declare menu_55692: string;
  declare hidden_field_1: string;
  declare form_date: Date;

  public static associate(models: any) {
  }
}

DmCf7db3848.init(
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
    phonetext_737: {
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
    modelName: 'DmCf7db3848',
    tableName: 'dm_cf7db_3848',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCf7db3848 };
export type { DmCf7db3848Attributes, DmCf7db3848CreationAttributes };
