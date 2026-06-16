import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmForm4691Attributes {
  id: number;
  db4_status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  your_message: string | null;
  form_date: Date;
}

interface DmForm4691CreationAttributes extends Optional<DmForm4691Attributes, 'name' | 'email' | 'phone' | 'your_message' | 'form_date'> {}

class DmForm4691 extends Model<DmForm4691Attributes, DmForm4691CreationAttributes> implements DmForm4691Attributes {
  public id!: number;
  public db4_status!: string;
  public name!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public your_message!: string | null;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

DmForm4691.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    db4_status: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    your_message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    form_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    modelName: 'DmForm4691',
    tableName: 'dm_form_4691',
    timestamps: false,
    freezeTableName: true,
  });

export { DmForm4691 };
export type { DmForm4691Attributes, DmForm4691CreationAttributes };
