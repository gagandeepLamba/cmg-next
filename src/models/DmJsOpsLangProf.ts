import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJsOpsLangProfAttributes {
  id: number;
  leadId: number;
  tab: number | null;
  langTest: string | null;
  spLangTest: string | null;
  testStatus: string | null;
  expiryDate: string | null;
  testDate: string | null;
  testScore: string | null;
  rating: string | null;
  reading: string | null;
  writing: string | null;
  listening: string | null;
  speaking: string | null;
  meetingreq: string | null;
}

interface DmJsOpsLangProfCreationAttributes extends Optional<DmJsOpsLangProfAttributes, 'tab' | 'langTest' | 'spLangTest' | 'testStatus' | 'expiryDate' | 'testDate' | 'testScore' | 'rating' | 'reading' | 'writing' | 'listening' | 'speaking' | 'meetingreq'> {}

class DmJsOpsLangProf extends Model<DmJsOpsLangProfAttributes, DmJsOpsLangProfCreationAttributes> implements DmJsOpsLangProfAttributes {
  declare id: number;
  declare leadId: number;
  declare tab: number | null;
  declare langTest: string | null;
  declare spLangTest: string | null;
  declare testStatus: string | null;
  declare expiryDate: string | null;
  declare testDate: string | null;
  declare testScore: string | null;
  declare rating: string | null;
  declare reading: string | null;
  declare writing: string | null;
  declare listening: string | null;
  declare speaking: string | null;
  declare meetingreq: string | null;

  public static associate(models: any) {
  }
}

DmJsOpsLangProf.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    langTest: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spLangTest: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    testStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    testDate: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    testScore: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rating: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    reading: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    writing: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    listening: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    speaking: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    meetingreq: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmJsOpsLangProf',
    tableName: 'dm_js_ops_lang_prof',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJsOpsLangProf };
export type { DmJsOpsLangProfAttributes, DmJsOpsLangProfCreationAttributes };
