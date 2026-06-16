import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsDocumentsAttributes {
  id: number;
  opsId: number | null;
  doc_type: string | null;
  doc_uploaded_for: string | null;
  leadId: number | null;
  tab: number | null;
  name: string | null;
  file: string | null;
  created: Date | null;
  created_by: number;
  status: number;
  remarks: string | null;
  download_file: number;
}

interface DmOpsDocumentsCreationAttributes extends Optional<DmOpsDocumentsAttributes, 'opsId' | 'doc_type' | 'doc_uploaded_for' | 'leadId' | 'tab' | 'name' | 'file' | 'created' | 'status' | 'remarks'> {}

class DmOpsDocuments extends Model<DmOpsDocumentsAttributes, DmOpsDocumentsCreationAttributes> implements DmOpsDocumentsAttributes {
  public id!: number;
  public opsId!: number | null;
  public doc_type!: string | null;
  public doc_uploaded_for!: string | null;
  public leadId!: number | null;
  public tab!: number | null;
  public name!: string | null;
  public file!: string | null;
  public created!: Date | null;
  public created_by!: number;
  public status!: number;
  public remarks!: string | null;
  public download_file!: number;

  public static associate(models: any) {
    DmOpsDocuments.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmOpsDocuments.init(
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    modelName: 'DmOpsDocuments',
    tableName: 'dm_ops_documents',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsDocuments };
export type { DmOpsDocumentsAttributes, DmOpsDocumentsCreationAttributes };
