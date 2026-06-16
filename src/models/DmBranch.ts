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
}

interface DmBranchCreationAttributes extends Optional<DmBranchAttributes, 'status'> {}

class DmBranch extends Model<DmBranchAttributes, DmBranchCreationAttributes> implements DmBranchAttributes {
  public id!: number;
  public name!: string;
  public ar_name!: string;
  public branch!: string;
  public region!: number;
  public abbrv!: string;
  public address!: string;
  public ar_address!: string;
  public email!: string;
  public mobile!: string;
  public status!: number;
  public website!: string;

  public static associate(models: any) {
    DmBranch.hasMany(models.DmcForumLeads, { foreignKey: 'branch', sourceKey: 'id', as: 'dmcForumLeadss' });
    DmBranch.hasMany(models.DmFee, { foreignKey: 'branch', sourceKey: 'id', as: 'dmFees' });
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
