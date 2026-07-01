import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsSAAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsSACreationAttributes extends Optional<MasterSheetsSAAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsSA extends Model<MasterSheetsSAAttributes, MasterSheetsSACreationAttributes> implements MasterSheetsSAAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsSA.init(
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
    modelName: 'MasterSheetsSA',
    tableName: 'master_sheets_SA',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsSA };
export type { MasterSheetsSAAttributes, MasterSheetsSACreationAttributes };
