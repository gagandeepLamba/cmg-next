import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCf7db3870Attributes {
  id: number;
  cf7dbp_status: string;
  cyour_name: string;
  phonetext_503: string;
  your_email: string;
  hidden_field_1: string;
  form_date: Date;
}

interface DmCf7db3870CreationAttributes extends Optional<DmCf7db3870Attributes, 'form_date'> {}

class DmCf7db3870 extends Model<DmCf7db3870Attributes, DmCf7db3870CreationAttributes> implements DmCf7db3870Attributes {
  public id!: number;
  public cf7dbp_status!: string;
  public cyour_name!: string;
  public phonetext_503!: string;
  public your_email!: string;
  public hidden_field_1!: string;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

DmCf7db3870.init(
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
    phonetext_503: {
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
    modelName: 'DmCf7db3870',
    tableName: 'dm_cf7db_3870',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCf7db3870 };
export type { DmCf7db3870Attributes, DmCf7db3870CreationAttributes };
