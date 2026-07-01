import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EeprofileAttributes {
  id: number;
  leadid: number | null;
  docrec: string | null;
  docstat: string | null;
  pcfswp: string | null;
  noc: string | null;
  snoc: string;
  pldate: string | null;
  pfexp: string | null;
  crs: string | null;
  status: string | null;
  type: string | null;
}

interface EeprofileCreationAttributes extends Optional<EeprofileAttributes, 'leadid' | 'docrec' | 'docstat' | 'pcfswp' | 'noc' | 'pldate' | 'pfexp' | 'crs' | 'status' | 'type'> {}

class Eeprofile extends Model<EeprofileAttributes, EeprofileCreationAttributes> implements EeprofileAttributes {
  public id!: number;
  public leadid!: number | null;
  public docrec!: string | null;
  public docstat!: string | null;
  public pcfswp!: string | null;
  public noc!: string | null;
  public snoc!: string;
  public pldate!: string | null;
  public pfexp!: string | null;
  public crs!: string | null;
  public status!: string | null;
  public type!: string | null;

  public static associate(models: any) {
  }
}

Eeprofile.init(
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
    docrec: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    docstat: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pcfswp: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    noc: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    snoc: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    pldate: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pfexp: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    crs: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'Eeprofile',
    tableName: 'eeprofile',
    timestamps: false,
    freezeTableName: true,
  });

export { Eeprofile };
export type { EeprofileAttributes, EeprofileCreationAttributes };
