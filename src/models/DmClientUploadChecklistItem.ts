import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmClientUploadChecklistItemAttributes {
  id: number;
  portalId: number;
  itemName: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  fileUrl: string | null;
  uploadedAt: Date | null;
  verifiedBy: number | null;
  verifiedAt: Date | null;
  notes: string | null;
}

interface DmClientUploadChecklistItemCreationAttributes extends Optional<DmClientUploadChecklistItemAttributes, 'id' | 'fileUrl' | 'uploadedAt' | 'verifiedBy' | 'verifiedAt' | 'notes'> {}

class DmClientUploadChecklistItem extends Model<DmClientUploadChecklistItemAttributes, DmClientUploadChecklistItemCreationAttributes> implements DmClientUploadChecklistItemAttributes {
  public id!: number;
  public portalId!: number;
  public itemName!: string;
  public required!: boolean;
  public status!: 'pending' | 'uploaded' | 'verified' | 'rejected';
  public fileUrl!: string | null;
  public uploadedAt!: Date | null;
  public verifiedBy!: number | null;
  public verifiedAt!: Date | null;
  public notes!: string | null;

  public static associate(models: any) {
    DmClientUploadChecklistItem.belongsTo(models.DmClientUploadPortal, { foreignKey: 'portalId', targetKey: 'id', as: 'portal' });
  }
}

DmClientUploadChecklistItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    portalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_client_upload_portals',
        key: 'id'
      }
    },
    itemName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'uploaded', 'verified', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'DmClientUploadChecklistItem',
    tableName: 'dm_client_upload_checklist_items',
    timestamps: false,
    freezeTableName: true,
  }
);

export { DmClientUploadChecklistItem };
export type { DmClientUploadChecklistItemAttributes, DmClientUploadChecklistItemCreationAttributes };
