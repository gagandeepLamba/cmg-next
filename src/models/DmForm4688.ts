import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmForm4688Attributes {
  id: number;
  db4_status: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  migrate: string | null;
  age_range: string | null;
  education: string | null;
  immigration_type: string | null;
  your_preferred_location: string | null;
  form_date: Date;
  done: number;
}

interface DmForm4688CreationAttributes extends Optional<DmForm4688Attributes, 'name' | 'phone' | 'email' | 'migrate' | 'age_range' | 'education' | 'immigration_type' | 'your_preferred_location' | 'form_date'> {}

class DmForm4688 extends Model<DmForm4688Attributes, DmForm4688CreationAttributes> implements DmForm4688Attributes {
  public id!: number;
  public db4_status!: string;
  public name!: string | null;
  public phone!: string | null;
  public email!: string | null;
  public migrate!: string | null;
  public age_range!: string | null;
  public education!: string | null;
  public immigration_type!: string | null;
  public your_preferred_location!: string | null;
  public form_date!: Date;
  public done!: number;

  public static associate(models: any) {
  }
}

DmForm4688.init(
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
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    migrate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    age_range: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    education: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    immigration_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    your_preferred_location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    form_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    done: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmForm4688',
    tableName: 'dm_form_4688',
    timestamps: false,
    freezeTableName: true,
  });

export { DmForm4688 };
export type { DmForm4688Attributes, DmForm4688CreationAttributes };
