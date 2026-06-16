import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsAttributes {
  id: number;
  userid: number | null;
  file: string | null;
}

interface MasterSheetsCreationAttributes extends Optional<MasterSheetsAttributes, 'userid' | 'file'> {}

class MasterSheets extends Model<MasterSheetsAttributes, MasterSheetsCreationAttributes> implements MasterSheetsAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;

  public static associate(models: any) {
  }
}

MasterSheets.init(
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
  },
  {
    sequelize,
    modelName: 'MasterSheets',
    tableName: 'master_sheets',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheets };
export type { MasterSheetsAttributes, MasterSheetsCreationAttributes };
