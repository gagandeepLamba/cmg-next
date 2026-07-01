import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsECAAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsECACreationAttributes extends Optional<MasterSheetsECAAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsECA extends Model<MasterSheetsECAAttributes, MasterSheetsECACreationAttributes> implements MasterSheetsECAAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsECA.init(
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
    modelName: 'MasterSheetsECA',
    tableName: 'master_sheets_ECA',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsECA };
export type { MasterSheetsECAAttributes, MasterSheetsECACreationAttributes };
