import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmProspectRemarksAttributes {
  id: number;
  prospectId: number;
  date: Date;
  remark: string;
  employeeId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmProspectRemarksCreationAttributes extends Optional<DmProspectRemarksAttributes, 'id' | 'date' | 'createdAt' | 'updatedAt'> {}

class DmProspectRemarks extends Model<DmProspectRemarksAttributes, DmProspectRemarksCreationAttributes> implements DmProspectRemarksAttributes {
  declare id: number;
  declare prospectId: number;
  declare date: Date;
  declare remark: string;
  declare employeeId: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  public static associate(models: any) {
    DmProspectRemarks.belongsTo(models.DmProspects, { foreignKey: 'prospectId', targetKey: 'id', as: 'prospect' });
    DmProspectRemarks.belongsTo(models.DmEmployee, { foreignKey: 'employeeId', targetKey: 'id', as: 'employee' });
  }
}

DmProspectRemarks.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    prospectId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    remark: { type: DataTypes.TEXT, allowNull: false },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: 'DmProspectRemarks',
    tableName: 'dm_prospect_remarks',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmProspectRemarks };
export type { DmProspectRemarksAttributes, DmProspectRemarksCreationAttributes };
