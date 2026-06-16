import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmForm4695Attributes {
  id: number;
  db4_status: string;
  name: string | null;
  email: string | null;
  comment_or_message: string | null;
  form_date: Date;
}

interface DmForm4695CreationAttributes extends Optional<DmForm4695Attributes, 'name' | 'email' | 'comment_or_message' | 'form_date'> {}

class DmForm4695 extends Model<DmForm4695Attributes, DmForm4695CreationAttributes> implements DmForm4695Attributes {
  public id!: number;
  public db4_status!: string;
  public name!: string | null;
  public email!: string | null;
  public comment_or_message!: string | null;
  public form_date!: Date;

  public static associate(models: any) {
  }
}

DmForm4695.init(
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
    comment_or_message: {
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
    modelName: 'DmForm4695',
    tableName: 'dm_form_4695',
    timestamps: false,
    freezeTableName: true,
  });

export { DmForm4695 };
export type { DmForm4695Attributes, DmForm4695CreationAttributes };
