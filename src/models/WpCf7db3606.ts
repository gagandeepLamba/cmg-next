import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface WpCf7db3606Attributes {
  id: number;
  cf7dbp_status: string;
  your_name: string;
  your_email_52: string;
  tel_86105: string;
  text_34684: string;
  your_message_58: string;
  hidden_field_1: string;
  form_date: Date;
}

interface WpCf7db3606CreationAttributes extends Optional<WpCf7db3606Attributes, 'form_date'> {}

class WpCf7db3606 extends Model<WpCf7db3606Attributes, WpCf7db3606CreationAttributes> implements WpCf7db3606Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public your_name!: string;
  public your_email_52!: string;
  public tel_86105!: string;
  public text_34684!: string;
  public your_message_58!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

WpCf7db3606.init(
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
    your_email_52: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tel_86105: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    text_34684: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_message_58: {
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
    modelName: 'WpCf7db3606',
    tableName: 'wp_cf7db_3606',
    timestamps: false,
    freezeTableName: true,
  });

export { WpCf7db3606 };
export type { WpCf7db3606Attributes, WpCf7db3606CreationAttributes };
