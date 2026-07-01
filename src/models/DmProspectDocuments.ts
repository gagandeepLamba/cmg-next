import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmProspectDocumentsAttributes {
  id: number;
  prospectId: number;
  name: string;
  uploadDate: Date;
  url: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DmProspectDocumentsCreationAttributes extends Optional<DmProspectDocumentsAttributes, 'id' | 'uploadDate' | 'type' | 'createdAt' | 'updatedAt'> {}

class DmProspectDocuments extends Model<DmProspectDocumentsAttributes, DmProspectDocumentsCreationAttributes> implements DmProspectDocumentsAttributes {
  public id!: number;
  public prospectId!: number;
  public name!: string;
  public uploadDate!: Date;
  public url!: string;
  public type!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmProspectDocuments.belongsTo(models.DmProspects, { foreignKey: 'prospectId', targetKey: 'id', as: 'prospect' });
  }
}

DmProspectDocuments.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    prospectId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    uploadDate: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    url: { type: DataTypes.STRING(500), allowNull: false },
    type: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'document' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'DmProspectDocuments',
    tableName: 'dm_prospect_documents',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmProspectDocuments };
export type { DmProspectDocumentsAttributes, DmProspectDocumentsCreationAttributes };
