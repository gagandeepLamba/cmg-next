import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AusNomOldAttributes {
  id: number;
  agreeNo: string | null;
  nomstate: string | null;
  subdate: string | null;
  nomexpdate: string | null;
  file: string | null;
  nomStatus: string;
  created: Date;
}

interface AusNomOldCreationAttributes extends Optional<AusNomOldAttributes, 'agreeNo' | 'nomstate' | 'subdate' | 'nomexpdate' | 'file'> {}

class AusNomOld extends Model<AusNomOldAttributes, AusNomOldCreationAttributes> implements AusNomOldAttributes {
  public id!: number;
  public agreeNo!: string | null;
  public nomstate!: string | null;
  public subdate!: string | null;
  public nomexpdate!: string | null;
  public file!: string | null;
  public nomStatus!: string;
  public created!: Date;

  public static associate(models: any) {
  }
}

AusNomOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nomstate: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    subdate: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nomexpdate: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nomStatus: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'AusNomOld',
    tableName: 'aus_nom_old',
    timestamps: false,
    freezeTableName: true,
  });

export { AusNomOld };
export type { AusNomOldAttributes, AusNomOldCreationAttributes };
