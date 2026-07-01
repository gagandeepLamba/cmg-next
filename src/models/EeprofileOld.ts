import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EeprofileOldAttributes {
  id: number;
  agreeNo: number | null;
  docrec: string | null;
  docstat: string | null;
  pcfswp: string | null;
  noc: string | null;
  pldate: string | null;
  pfexp: string | null;
  crs: string | null;
  status: string | null;
  type: string | null;
}

interface EeprofileOldCreationAttributes extends Optional<EeprofileOldAttributes, 'agreeNo' | 'docrec' | 'docstat' | 'pcfswp' | 'noc' | 'pldate' | 'pfexp' | 'crs' | 'status' | 'type'> {}

class EeprofileOld extends Model<EeprofileOldAttributes, EeprofileOldCreationAttributes> implements EeprofileOldAttributes {
  public id!: number;
  public agreeNo!: number | null;
  public docrec!: string | null;
  public docstat!: string | null;
  public pcfswp!: string | null;
  public noc!: string | null;
  public pldate!: string | null;
  public pfexp!: string | null;
  public crs!: string | null;
  public status!: string | null;
  public type!: string | null;

  public static associate(models: any) {
  }
}

EeprofileOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
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
    modelName: 'EeprofileOld',
    tableName: 'eeprofile_old',
    timestamps: false,
    freezeTableName: true,
  });

export { EeprofileOld };
export type { EeprofileOldAttributes, EeprofileOldCreationAttributes };
