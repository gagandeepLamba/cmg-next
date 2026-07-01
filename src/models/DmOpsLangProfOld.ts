import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsLangProfOldAttributes {
  id: number;
  agreeNo: number;
  tab: number;
  langTest: string;
  spLangTest: string;
  testStatus: string;
  expiryDate: string;
  testDate: string;
  testScore: string;
  rating: string;
  reading: string;
  writing: string;
  listening: string;
  speaking: string;
  meetingreq: string;
}

interface DmOpsLangProfOldCreationAttributes extends Optional<DmOpsLangProfOldAttributes, never> {}

class DmOpsLangProfOld extends Model<DmOpsLangProfOldAttributes, DmOpsLangProfOldCreationAttributes> implements DmOpsLangProfOldAttributes {
  public id!: number;
  public agreeNo!: number;
  public tab!: number;
  public langTest!: string;
  public spLangTest!: string;
  public testStatus!: string;
  public expiryDate!: string;
  public testDate!: string;
  public testScore!: string;
  public rating!: string;
  public reading!: string;
  public writing!: string;
  public listening!: string;
  public speaking!: string;
  public meetingreq!: string;

  public static associate(models: any) {
  }
}

DmOpsLangProfOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    langTest: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    spLangTest: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    testStatus: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    testDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    testScore: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rating: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    reading: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    writing: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    listening: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    speaking: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    meetingreq: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsLangProfOld',
    tableName: 'dm_ops_lang_prof_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsLangProfOld };
export type { DmOpsLangProfOldAttributes, DmOpsLangProfOldCreationAttributes };
