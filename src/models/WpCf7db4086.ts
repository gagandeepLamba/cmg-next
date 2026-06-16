import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface WpCf7db4086Attributes {
  id: number;
  cf7dbp_status: string;
  your_name_car: string;
  your_email_car: string;
  tel_861_car: string;
  your_message_car: string;
  file_898_cf7dbp_file: string;
  hidden_field_1: string;
  form_date: Date;
}

interface WpCf7db4086CreationAttributes extends Optional<WpCf7db4086Attributes, 'form_date'> {}

class WpCf7db4086 extends Model<WpCf7db4086Attributes, WpCf7db4086CreationAttributes> implements WpCf7db4086Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public your_name_car!: string;
  public your_email_car!: string;
  public tel_861_car!: string;
  public your_message_car!: string;
  public file_898_cf7dbp_file!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

WpCf7db4086.init(
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
    your_name_car: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_email_car: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tel_861_car: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_message_car: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    file_898_cf7dbp_file: {
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
    modelName: 'WpCf7db4086',
    tableName: 'wp_cf7db_4086',
    timestamps: false,
    freezeTableName: true,
  });

export { WpCf7db4086 };
export type { WpCf7db4086Attributes, WpCf7db4086CreationAttributes };
