import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmClientUploadPortalAttributes {
  id: number;
  clientId: string;
  leadId: number;
  opportunityId: number | null;
  agreementNumber: string | null;
  accessToken: string;
  status: 'active' | 'closed' | 'expired';
  expiresAt: Date | null;
  createdAt: Date;
}

interface DmClientUploadPortalCreationAttributes extends Optional<DmClientUploadPortalAttributes, 'id' | 'opportunityId' | 'agreementNumber' | 'expiresAt'> {}

class DmClientUploadPortal extends Model<DmClientUploadPortalAttributes, DmClientUploadPortalCreationAttributes> implements DmClientUploadPortalAttributes {
  declare id: number;
  declare clientId: string;
  declare leadId: number;
  declare opportunityId: number | null;
  declare agreementNumber: string | null;
  declare accessToken: string;
  declare status: 'active' | 'closed' | 'expired';
  declare expiresAt: Date | null;
  declare createdAt: Date;

  public static associate(models: any) {
    DmClientUploadPortal.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' });
    DmClientUploadPortal.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'opportunity' });
  }
}

DmClientUploadPortal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dmc_forum_leads',
        key: 'id'
      }
    },
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dmc_opportunities',
        key: 'id'
      }
    },
    agreementNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    accessToken: {
      type: DataTypes.CHAR(64),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('active', 'closed', 'expired'),
      allowNull: false,
      defaultValue: 'active'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'DmClientUploadPortal',
    tableName: 'dm_client_upload_portals',
    timestamps: false,
    freezeTableName: true,
  }
);

export { DmClientUploadPortal };
export type { DmClientUploadPortalAttributes, DmClientUploadPortalCreationAttributes };
