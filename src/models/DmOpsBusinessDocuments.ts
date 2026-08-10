import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsBusinessDocumentsAttributes {
  id: number;
  opsId: number | null;
  doc_type: string | null;
  doc_uploaded_for: string | null;
  leadId: number | null;
  tab: number | null;
  name: string | null;
  file: string | null;
  created: Date | null;
  status: number;
  remarks: string | null;
  download_file: number;
}

interface DmOpsBusinessDocumentsCreationAttributes extends Optional<DmOpsBusinessDocumentsAttributes, 'opsId' | 'doc_type' | 'doc_uploaded_for' | 'leadId' | 'tab' | 'name' | 'file' | 'created' | 'status' | 'remarks'> {}

class DmOpsBusinessDocuments extends Model<DmOpsBusinessDocumentsAttributes, DmOpsBusinessDocumentsCreationAttributes> implements DmOpsBusinessDocumentsAttributes {
  declare id: number;
  declare opsId: number | null;
  declare doc_type: string | null;
  declare doc_uploaded_for: string | null;
  declare leadId: number | null;
  declare tab: number | null;
  declare name: string | null;
  declare file: string | null;
  declare created: Date | null;
  declare status: number;
  declare remarks: string | null;
  declare download_file: number;

  public static associate(models: any) {
  }
}

DmOpsBusinessDocuments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    opsId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    doc_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    doc_uploaded_for: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    download_file: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsBusinessDocuments',
    tableName: 'dm_ops_business_documents',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsBusinessDocuments };
export type { DmOpsBusinessDocumentsAttributes, DmOpsBusinessDocumentsCreationAttributes };
