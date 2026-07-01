import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsITAAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsITACreationAttributes extends Optional<MasterSheetsITAAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsITA extends Model<MasterSheetsITAAttributes, MasterSheetsITACreationAttributes> implements MasterSheetsITAAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsITA.init(
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
    modelName: 'MasterSheetsITA',
    tableName: 'master_sheets_ITA',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsITA };
export type { MasterSheetsITAAttributes, MasterSheetsITACreationAttributes };
