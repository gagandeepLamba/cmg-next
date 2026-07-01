import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsEoiAustraliaAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsEoiAustraliaCreationAttributes extends Optional<MasterSheetsEoiAustraliaAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsEoiAustralia extends Model<MasterSheetsEoiAustraliaAttributes, MasterSheetsEoiAustraliaCreationAttributes> implements MasterSheetsEoiAustraliaAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsEoiAustralia.init(
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
    modelName: 'MasterSheetsEoiAustralia',
    tableName: 'master_sheets_eoi_australia',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsEoiAustralia };
export type { MasterSheetsEoiAustraliaAttributes, MasterSheetsEoiAustraliaCreationAttributes };
