import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface MasterSheetsEIPAttributes {
  id: number;
  userid: number | null;
  file: string | null;
  date: string | null;
}

interface MasterSheetsEIPCreationAttributes extends Optional<MasterSheetsEIPAttributes, 'userid' | 'file' | 'date'> {}

class MasterSheetsEIP extends Model<MasterSheetsEIPAttributes, MasterSheetsEIPCreationAttributes> implements MasterSheetsEIPAttributes {
  public id!: number;
  public userid!: number | null;
  public file!: string | null;
  public date!: string | null;

  public static associate(models: any) {
  }
}

MasterSheetsEIP.init(
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
    modelName: 'MasterSheetsEIP',
    tableName: 'master_sheets_EIP',
    timestamps: false,
    freezeTableName: true,
  });

export { MasterSheetsEIP };
export type { MasterSheetsEIPAttributes, MasterSheetsEIPCreationAttributes };
