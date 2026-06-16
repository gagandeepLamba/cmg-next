import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsEUAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsEUCreationAttributes extends Optional<MasterSheetsEUAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsEU extends Model<MasterSheetsEUAttributes, MasterSheetsEUCreationAttributes> implements MasterSheetsEUAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsEU.init(
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
    modelName: 'MasterSheetsEU',
    tableName: 'master_sheets_EU',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsEU };
export type { MasterSheetsEUAttributes, MasterSheetsEUCreationAttributes };
