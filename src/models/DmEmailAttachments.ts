import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmailAttachmentsAttributes {
  id: number;
  email_template_id: number;
  attachments: string;
  status: number;
  created_by: number;
  created: Date;
}

interface DmEmailAttachmentsCreationAttributes extends Optional<DmEmailAttachmentsAttributes, never> {}

class DmEmailAttachments extends Model<DmEmailAttachmentsAttributes, DmEmailAttachmentsCreationAttributes> implements DmEmailAttachmentsAttributes {
  public id!: number;
  public email_template_id!: number;
  public attachments!: string;
  public status!: number;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmEmailAttachments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attachments: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmailAttachments',
    tableName: 'dm_email_attachments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmailAttachments };
export type { DmEmailAttachmentsAttributes, DmEmailAttachmentsCreationAttributes };
