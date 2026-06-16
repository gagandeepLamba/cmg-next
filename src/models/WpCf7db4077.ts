import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface WpCf7db4077Attributes {
  id: number;
  cf7dbp_status: string;
  your_name_52: string;
  your_email_592: string;
  tel_88965: string;
  text_301504: string;
  your_message_55986021: string;
  hidden_field_1: string;
  form_date: Date;
}

interface WpCf7db4077CreationAttributes extends Optional<WpCf7db4077Attributes, 'form_date'> {}

class WpCf7db4077 extends Model<WpCf7db4077Attributes, WpCf7db4077CreationAttributes> implements WpCf7db4077Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public your_name_52!: string;
  public your_email_592!: string;
  public tel_88965!: string;
  public text_301504!: string;
  public your_message_55986021!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

WpCf7db4077.init(
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
    your_name_52: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_email_592: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tel_88965: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    text_301504: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_message_55986021: {
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
    modelName: 'WpCf7db4077',
    tableName: 'wp_cf7db_4077',
    timestamps: false,
    freezeTableName: true,
  });

export { WpCf7db4077 };
export type { WpCf7db4077Attributes, WpCf7db4077CreationAttributes };
