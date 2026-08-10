import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmProspectsAttributes {
  id: number;
  agreementNumber: string;
  date: Date;
  oldNew: string;
  noc: string;
  counselorId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DmProspectsCreationAttributes extends Optional<DmProspectsAttributes, 'id' | 'date' | 'oldNew' | 'status' | 'createdAt' | 'updatedAt'> {}

class DmProspects extends Model<DmProspectsAttributes, DmProspectsCreationAttributes> implements DmProspectsAttributes {
  declare id: number;
  declare agreementNumber: string;
  declare date: Date;
  declare oldNew: string;
  declare noc: string;
  declare counselorId: number;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  public static associate(models: any) {
    DmProspects.belongsTo(models.DmEmployee, { foreignKey: 'counselorId', targetKey: 'id', as: 'counselor' });
    DmProspects.hasMany(models.DmProspectDocuments, { foreignKey: 'prospectId', sourceKey: 'id', as: 'documents' });
    DmProspects.hasMany(models.DmProspectRemarks, { foreignKey: 'prospectId', sourceKey: 'id', as: 'remarks' });
  }
}

DmProspects.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    agreementNumber: { type: DataTypes.STRING(100), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    oldNew: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'new' },
    noc: { type: DataTypes.STRING(255), allowNull: false },
    counselorId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'DmProspects',
    tableName: 'dm_prospects',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmProspects };
export type { DmProspectsAttributes, DmProspectsCreationAttributes };
