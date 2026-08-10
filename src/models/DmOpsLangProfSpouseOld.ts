import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsLangProfSpouseOldAttributes {
  id: number;
  agreeNo: number;
  tab: number;
  langTest: string;
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

interface DmOpsLangProfSpouseOldCreationAttributes extends Optional<DmOpsLangProfSpouseOldAttributes, never> {}

class DmOpsLangProfSpouseOld extends Model<DmOpsLangProfSpouseOldAttributes, DmOpsLangProfSpouseOldCreationAttributes> implements DmOpsLangProfSpouseOldAttributes {
  declare id: number;
  declare agreeNo: number;
  declare tab: number;
  declare langTest: string;
  declare testStatus: string;
  declare expiryDate: string;
  declare testDate: string;
  declare testScore: string;
  declare rating: string;
  declare reading: string;
  declare writing: string;
  declare listening: string;
  declare speaking: string;
  declare meetingreq: string;

  public static associate(models: any) {
  }
}

DmOpsLangProfSpouseOld.init(
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
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsLangProfSpouseOld',
    tableName: 'dm_ops_lang_prof_spouse_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsLangProfSpouseOld };
export type { DmOpsLangProfSpouseOldAttributes, DmOpsLangProfSpouseOldCreationAttributes };
