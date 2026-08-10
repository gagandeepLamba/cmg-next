import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OldDataPunAttributes {
  temp_id: number;
  id: number | null;
  sign_up_date: string | null;
  agreeNo: number | null;
  client_name: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  counselor: string | null;
  status: string;
}

interface OldDataPunCreationAttributes extends Optional<OldDataPunAttributes, 'id' | 'sign_up_date' | 'agreeNo' | 'client_name' | 'mobile' | 'email' | 'country' | 'counselor'> {}

class OldDataPun extends Model<OldDataPunAttributes, OldDataPunCreationAttributes> implements OldDataPunAttributes {
  declare temp_id: number;
  declare id: number | null;
  declare sign_up_date: string | null;
  declare agreeNo: number | null;
  declare client_name: string | null;
  declare mobile: string | null;
  declare email: string | null;
  declare country: string | null;
  declare counselor: string | null;
  declare status: string;

  public static associate(models: any) {
  }
}

OldDataPun.init(
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
    sign_up_date: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    agreeNo: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    client_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(100),
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
    modelName: 'OldDataPun',
    tableName: 'old_data_pun',
    timestamps: false,
    freezeTableName: true,
  });

export { OldDataPun };
export type { OldDataPunAttributes, OldDataPunCreationAttributes };
