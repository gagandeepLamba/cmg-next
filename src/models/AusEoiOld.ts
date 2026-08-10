import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AusEoiOldAttributes {
  id: number;
  leadid: string | null;
  dol: string | null;
  doe: string | null;
  points: number | null;
  eoi_status: string | null;
  pof: string | null;
  statcat: string;
  state: string | null;
  file: string | null;
}

interface AusEoiOldCreationAttributes extends Optional<AusEoiOldAttributes, 'leadid' | 'dol' | 'doe' | 'points' | 'eoi_status' | 'pof' | 'state' | 'file'> {}

class AusEoiOld extends Model<AusEoiOldAttributes, AusEoiOldCreationAttributes> implements AusEoiOldAttributes {
  declare id: number;
  declare leadid: string | null;
  declare dol: string | null;
  declare doe: string | null;
  declare points: number | null;
  declare eoi_status: string | null;
  declare pof: string | null;
  declare statcat: string;
  declare state: string | null;
  declare file: string | null;

  public static associate(models: any) {
  }
}

AusEoiOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    dol: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    doe: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    eoi_status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pof: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    statcat: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'AusEoiOld',
    tableName: 'aus_eoi_old',
    timestamps: false,
    freezeTableName: true,
  });

export { AusEoiOld };
export type { AusEoiOldAttributes, AusEoiOldCreationAttributes };
