import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAdditionalDocumentsAttributes {
  id: number;
  leadId: number;
  document: string;
  purpose: string;
  created: Date;
  created_by: number;
  remarks: string;
}

interface DmAdditionalDocumentsCreationAttributes extends Optional<DmAdditionalDocumentsAttributes, never> {}

class DmAdditionalDocuments extends Model<DmAdditionalDocumentsAttributes, DmAdditionalDocumentsCreationAttributes> implements DmAdditionalDocumentsAttributes {
  public id!: number;
  public leadId!: number;
  public document!: string;
  public purpose!: string;
  public created!: Date;
  public created_by!: number;
  public remarks!: string;

  public static associate(models: any) {
  }
}

DmAdditionalDocuments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    purpose: {
      type: DataTypes.STRING(255),
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
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmAdditionalDocuments',
    tableName: 'dm_additional_documents',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAdditionalDocuments };
export type { DmAdditionalDocumentsAttributes, DmAdditionalDocumentsCreationAttributes };
