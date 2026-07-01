import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AusEoiAttributes {
  id: number;
  leadid: number | null;
  dol: string | null;
  doe: string | null;
  points: number | null;
  eoi_status: string | null;
  pof: string | null;
  statcat: string;
  state: string | null;
  file: string | null;
}

interface AusEoiCreationAttributes extends Optional<AusEoiAttributes, 'leadid' | 'dol' | 'doe' | 'points' | 'eoi_status' | 'pof' | 'state' | 'file'> {}

class AusEoi extends Model<AusEoiAttributes, AusEoiCreationAttributes> implements AusEoiAttributes {
  public id!: number;
  public leadid!: number | null;
  public dol!: string | null;
  public doe!: string | null;
  public points!: number | null;
  public eoi_status!: string | null;
  public pof!: string | null;
  public statcat!: string;
  public state!: string | null;
  public file!: string | null;

  public static associate(models: any) {
    AusEoi.belongsTo(models.DmcForumLeads, { foreignKey: 'leadid', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

AusEoi.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
      type: DataTypes.INTEGER,
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
    modelName: 'AusEoi',
    tableName: 'aus_eoi',
    timestamps: false,
    freezeTableName: true,
  });

export { AusEoi };
export type { AusEoiAttributes, AusEoiCreationAttributes };
