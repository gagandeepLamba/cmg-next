import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmForm4690Attributes {
  id: number;
  db4_status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  your_message: string | null;
  form_date: Date;
}

interface DmForm4690CreationAttributes extends Optional<DmForm4690Attributes, 'name' | 'email' | 'phone' | 'subject' | 'your_message' | 'form_date'> {}

class DmForm4690 extends Model<DmForm4690Attributes, DmForm4690CreationAttributes> implements DmForm4690Attributes {
  public id!: number;
  public db4_status!: string;
  public name!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public subject!: string | null;
  public your_message!: string | null;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

DmForm4690.init(
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
    subject: {
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
    modelName: 'DmForm4690',
    tableName: 'dm_form_4690',
    timestamps: false,
    freezeTableName: true,
  });

export { DmForm4690 };
export type { DmForm4690Attributes, DmForm4690CreationAttributes };
