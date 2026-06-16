import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface WpCf7db3232Attributes {
  id: number;
  cf7dbp_status: string;
  cyour_name: string;
  tel_862055: string;
  your_email: string;
  hidden_field_1: string;
  form_date: Date;
}

interface WpCf7db3232CreationAttributes extends Optional<WpCf7db3232Attributes, 'form_date'> {}

class WpCf7db3232 extends Model<WpCf7db3232Attributes, WpCf7db3232CreationAttributes> implements WpCf7db3232Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public cyour_name!: string;
  public tel_862055!: string;
  public your_email!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

WpCf7db3232.init(
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
    cyour_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tel_862055: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    your_email: {
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
    modelName: 'WpCf7db3232',
    tableName: 'wp_cf7db_3232',
    timestamps: false,
    freezeTableName: true,
  });

export { WpCf7db3232 };
export type { WpCf7db3232Attributes, WpCf7db3232CreationAttributes };
