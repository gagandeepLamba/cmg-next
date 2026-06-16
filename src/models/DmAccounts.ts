import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAccountsAttributes {
  id: number;
  account_no: string | null;
  bank_address: string | null;
  bank_beneficiary: string | null;
  bank_name: string | null;
  iban: string | null;
  branch_id: string | null;
}

interface DmAccountsCreationAttributes extends Optional<DmAccountsAttributes, 'account_no' | 'bank_address' | 'bank_beneficiary' | 'bank_name' | 'iban' | 'branch_id'> {}

class DmAccounts extends Model<DmAccountsAttributes, DmAccountsCreationAttributes> implements DmAccountsAttributes {
  public id!: number;
  public account_no!: string | null;
  public bank_address!: string | null;
  public bank_beneficiary!: string | null;
  public bank_name!: string | null;
  public iban!: string | null;
  public branch_id!: string | null;

  public static associate(models: any) {
  }
}

DmAccounts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_no: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bank_address: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    bank_beneficiary: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    iban: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    branch_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmAccounts',
    tableName: 'dm_accounts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAccounts };
export type { DmAccountsAttributes, DmAccountsCreationAttributes };
