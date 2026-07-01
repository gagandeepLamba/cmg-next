import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsBusinessDosAttributes {
  id: number;
  leadId: number;
  LOSissuanceDate: Date;
  LOSexpiryDate: Date;
  designated_entity_name: string;
  PRFilingDate: Date;
  LOSFile: string;
  comments: string;
}

interface DmOpsBusinessDosCreationAttributes extends Optional<DmOpsBusinessDosAttributes, never> {}

class DmOpsBusinessDos extends Model<DmOpsBusinessDosAttributes, DmOpsBusinessDosCreationAttributes> implements DmOpsBusinessDosAttributes {
  public id!: number;
  public leadId!: number;
  public LOSissuanceDate!: Date;
  public LOSexpiryDate!: Date;
  public designated_entity_name!: string;
  public PRFilingDate!: Date;
  public LOSFile!: string;
  public comments!: string;

  public static associate(models: any) {
  }
}

DmOpsBusinessDos.init(
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
    LOSissuanceDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    LOSexpiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    designated_entity_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    PRFilingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    LOSFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsBusinessDos',
    tableName: 'dm_ops_business_dos',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsBusinessDos };
export type { DmOpsBusinessDosAttributes, DmOpsBusinessDosCreationAttributes };
