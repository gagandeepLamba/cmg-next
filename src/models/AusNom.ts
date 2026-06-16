import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AusNomAttributes {
  id: number;
  leadid: number | null;
  nomstate: string | null;
  subdate: string | null;
  nomexpdate: string | null;
  file: string | null;
  nomStatus: string;
  created: Date;
}

interface AusNomCreationAttributes extends Optional<AusNomAttributes, 'leadid' | 'nomstate' | 'subdate' | 'nomexpdate' | 'file'> {}

class AusNom extends Model<AusNomAttributes, AusNomCreationAttributes> implements AusNomAttributes {
  public id!: number;
  public leadid!: number | null;
  public nomstate!: string | null;
  public subdate!: string | null;
  public nomexpdate!: string | null;
  public file!: string | null;
  public nomStatus!: string;
  public created!: Date;

  public static associate(models: any) {
    AusNom.belongsTo(models.DmcForumLeads, { foreignKey: 'leadid', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

AusNom.init(
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
    modelName: 'AusNom',
    tableName: 'aus_nom',
    timestamps: false,
    freezeTableName: true,
  });

export { AusNom };
export type { AusNomAttributes, AusNomCreationAttributes };
