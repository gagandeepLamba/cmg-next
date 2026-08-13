import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmBranchAttributes {
  id: number;
  name: string;
  ar_name: string;
  branch: string;
  region: number;
  abbrv: string;
  address: string;
  ar_address: string;
  email: string;
  mobile: string;
  status: number;
  website: string;
  license_number: string | null;
  trn: string | null;
  vat_gst_percent: number | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_iban: string | null;
  bank_branch: string | null;
}

interface DmBranchCreationAttributes extends Optional<DmBranchAttributes, 'status' | 'license_number' | 'trn' | 'vat_gst_percent' | 'bank_name' | 'bank_account_name' | 'bank_account_number' | 'bank_iban' | 'bank_branch'> {}

class DmBranch extends Model<DmBranchAttributes, DmBranchCreationAttributes> implements DmBranchAttributes {
  declare id: number;
  declare name: string;
  declare ar_name: string;
  declare branch: string;
  declare region: number;
  declare abbrv: string;
  declare address: string;
  declare ar_address: string;
  declare email: string;
  declare mobile: string;
  declare status: number;
  declare website: string;
  declare license_number: string | null;
  declare trn: string | null;
  declare vat_gst_percent: number | null;
  declare bank_name: string | null;
  declare bank_account_name: string | null;
  declare bank_account_number: string | null;
  declare bank_iban: string | null;
  declare bank_branch: string | null;

  public static associate(models: any) {
    DmBranch.hasMany(models.DmcForumLeads, { foreignKey: 'branch', sourceKey: 'id', as: 'dmcForumLeadss' });
    DmBranch.hasMany(models.DmFee, { foreignKey: 'branch', sourceKey: 'id', as: 'dmFees' });
    DmBranch.hasMany(models.BranchTarget, { foreignKey: 'branch', sourceKey: 'id', as: 'branchTargets' });
    DmBranch.hasMany(models.DmOperationAllocations, { foreignKey: 'branch', sourceKey: 'id', as: 'operationAllocations' });
  }
}

DmBranch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    ar_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    branch: {
      type: DataTypes.STRING(75),
      allowNull: false
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    abbrv: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ar_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    license_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    trn: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    vat_gst_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    bank_account_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    bank_account_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bank_iban: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bank_branch: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmBranch',
    tableName: 'dm_branch',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBranch };
export type { DmBranchAttributes, DmBranchCreationAttributes };
