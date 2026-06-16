import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCf7db3606Attributes {
  id: number;
  cf7dbp_status: string;
  your_name: string;
  your_email_52: string;
  phonetext_535: string;
  text_34684: string;
  your_message_58: string;
  hidden_field_1: string;
  form_date: Date;
}

interface DmCf7db3606CreationAttributes extends Optional<DmCf7db3606Attributes, 'form_date'> {}

class DmCf7db3606 extends Model<DmCf7db3606Attributes, DmCf7db3606CreationAttributes> implements DmCf7db3606Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public your_name!: string;
  public your_email_52!: string;
  public phonetext_535!: string;
  public text_34684!: string;
  public your_message_58!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

DmCf7db3606.init(
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
    phonetext_535: {
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
    modelName: 'DmCf7db3606',
    tableName: 'dm_cf7db_3606',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCf7db3606 };
export type { DmCf7db3606Attributes, DmCf7db3606CreationAttributes };
