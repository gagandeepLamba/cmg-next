import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OldData2Attributes {
  temp_id: number;
  id: number | null;
  agreeNo: string | null;
  sign_up_date: string | null;
  renDate: Date;
  renExpiryDate: Date;
  renew_type: string;
  client_name: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  branch: string | null;
  total_package: number | null;
  paid_amount: number | null;
  pending_amount: string | null;
  counselor: string | null;
  status: string | null;
}

interface OldData2CreationAttributes extends Optional<OldData2Attributes, 'id' | 'agreeNo' | 'sign_up_date' | 'client_name' | 'mobile' | 'email' | 'country' | 'branch' | 'total_package' | 'paid_amount' | 'pending_amount' | 'counselor' | 'status'> {}

class OldData2 extends Model<OldData2Attributes, OldData2CreationAttributes> implements OldData2Attributes {
  public temp_id!: number;
  public id!: number | null;
  public agreeNo!: string | null;
  public sign_up_date!: string | null;
  public renDate!: Date;
  public renExpiryDate!: Date;
  public renew_type!: string;
  public client_name!: string | null;
  public mobile!: string | null;
  public email!: string | null;
  public country!: string | null;
  public branch!: string | null;
  public total_package!: number | null;
  public paid_amount!: number | null;
  public pending_amount!: string | null;
  public counselor!: string | null;
  public status!: string | null;

  public static associate(models: any) {
  }
}

OldData2.init(
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
      type: DataTypes.STRING(111),
      allowNull: true
    },
    sign_up_date: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    renDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    renExpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    renew_type: {
      type: DataTypes.STRING(50),
      allowNull: false
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
    branch: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    total_package: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    paid_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    pending_amount: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    counselor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'OldData2',
    tableName: 'old_data_2',
    timestamps: false,
    freezeTableName: true,
  });

export { OldData2 };
export type { OldData2Attributes, OldData2CreationAttributes };
