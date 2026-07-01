import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsPNPAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsPNPCreationAttributes extends Optional<MasterSheetsPNPAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsPNP extends Model<MasterSheetsPNPAttributes, MasterSheetsPNPCreationAttributes> implements MasterSheetsPNPAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsPNP.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'MasterSheetsPNP',
    tableName: 'master_sheets_PNP',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsPNP };
export type { MasterSheetsPNPAttributes, MasterSheetsPNPCreationAttributes };
