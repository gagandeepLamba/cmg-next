import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsXPSAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsXPSCreationAttributes extends Optional<MasterSheetsXPSAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsXPS extends Model<MasterSheetsXPSAttributes, MasterSheetsXPSCreationAttributes> implements MasterSheetsXPSAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsXPS.init(
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
    modelName: 'MasterSheetsXPS',
    tableName: 'master_sheets_XPS',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsXPS };
export type { MasterSheetsXPSAttributes, MasterSheetsXPSCreationAttributes };
