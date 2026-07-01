import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmCampaignsAttributes {
  id: number;
  campaign: string;
  created: Date;
  created_by: number;
  status: number;
}

interface DmCampaignsCreationAttributes extends Optional<DmCampaignsAttributes, never> {}

class DmCampaigns extends Model<DmCampaignsAttributes, DmCampaignsCreationAttributes> implements DmCampaignsAttributes {
  public id!: number;
  public campaign!: string;
  public created!: Date;
  public created_by!: number;
  public status!: number;

  public static associate(models: any) {
  }
}

DmCampaigns.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    campaign: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmCampaigns',
    tableName: 'dm_campaigns',
    timestamps: false,
    freezeTableName: true,
  });

export { DmCampaigns };
export type { DmCampaignsAttributes, DmCampaignsCreationAttributes };
