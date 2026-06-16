import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface GaryProspectssAttributes {
  id: number;
  ag_no: number | null;
  date: string | null;
  old_new: string | null;
  noc: string | null;
  counselorid: number | null;
  terence: number | null;
  date_edit: string;
}

interface GaryProspectssCreationAttributes extends Optional<GaryProspectssAttributes, 'ag_no' | 'date' | 'old_new' | 'noc' | 'counselorid' | 'terence'> {}

class GaryProspectss extends Model<GaryProspectssAttributes, GaryProspectssCreationAttributes> implements GaryProspectssAttributes {
  public id!: number;
  public ag_no!: number | null;
  public date!: string | null;
  public old_new!: string | null;
  public noc!: string | null;
  public counselorid!: number | null;
  public terence!: number | null;
  public date_edit!: string;

  public static associate(models: any) {
  }
}

GaryProspectss.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ag_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    old_new: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    noc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    counselorid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    terence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date_edit: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'GaryProspectss',
    tableName: 'gary_prospectss',
    timestamps: false,
    freezeTableName: true,
  });

export { GaryProspectss };
export type { GaryProspectssAttributes, GaryProspectssCreationAttributes };
