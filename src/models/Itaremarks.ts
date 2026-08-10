import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface ItaremarksAttributes {
  id: number;
  leadId: number | null;
  date: string | null;
  remarks: string;
  addedby: number | null;
}

interface ItaremarksCreationAttributes extends Optional<ItaremarksAttributes, 'leadId' | 'date' | 'addedby'> {}

class Itaremarks extends Model<ItaremarksAttributes, ItaremarksCreationAttributes> implements ItaremarksAttributes {
  declare id: number;
  declare leadId: number | null;
  declare date: string | null;
  declare remarks: string;
  declare addedby: number | null;

  public static associate(models: any) {
  }
}

Itaremarks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    addedby: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'Itaremarks',
    tableName: 'itaremarks',
    timestamps: false,
    freezeTableName: true,
  });

export { Itaremarks };
export type { ItaremarksAttributes, ItaremarksCreationAttributes };
