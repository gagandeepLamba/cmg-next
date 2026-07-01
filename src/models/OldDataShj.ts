import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OldDataShjAttributes {
  temp_id: number;
  id: number | null;
  agreeNo: string | null;
  sign_up_date: string | null;
  client_name: string | null;
  mobile: number | null;
  email: string | null;
  country: string | null;
  counselor: string | null;
  status: string;
}

interface OldDataShjCreationAttributes extends Optional<OldDataShjAttributes, 'id' | 'agreeNo' | 'sign_up_date' | 'client_name' | 'mobile' | 'email' | 'country' | 'counselor'> {}

class OldDataShj extends Model<OldDataShjAttributes, OldDataShjCreationAttributes> implements OldDataShjAttributes {
  public temp_id!: number;
  public id!: number | null;
  public agreeNo!: string | null;
  public sign_up_date!: string | null;
  public client_name!: string | null;
  public mobile!: number | null;
  public email!: string | null;
  public country!: string | null;
  public counselor!: string | null;
  public status!: string;

  public static associate(models: any) {
  }
}

OldDataShj.init(
  {
    temp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sign_up_date: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    client_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mobile: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    counselor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'OldDataShj',
    tableName: 'old_data_shj',
    timestamps: false,
    freezeTableName: true,
  });

export { OldDataShj };
export type { OldDataShjAttributes, OldDataShjCreationAttributes };
