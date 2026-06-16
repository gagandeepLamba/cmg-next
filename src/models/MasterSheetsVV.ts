import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsVVAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsVVCreationAttributes extends Optional<MasterSheetsVVAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsVV extends Model<MasterSheetsVVAttributes, MasterSheetsVVCreationAttributes> implements MasterSheetsVVAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsVV.init(
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
    modelName: 'MasterSheetsVV',
    tableName: 'master_sheets_VV',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsVV };
export type { MasterSheetsVVAttributes, MasterSheetsVVCreationAttributes };
