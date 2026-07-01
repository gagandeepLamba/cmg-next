import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsLangProfSpouseAttributes {
  id: number;
  leadId: number;
  tab: number | null;
  langTest: string | null;
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

interface DmOpsLangProfSpouseCreationAttributes extends Optional<DmOpsLangProfSpouseAttributes, 'tab' | 'langTest' | 'testStatus' | 'expiryDate' | 'testDate' | 'testScore' | 'rating' | 'reading' | 'writing' | 'listening' | 'speaking' | 'meetingreq'> {}

class DmOpsLangProfSpouse extends Model<DmOpsLangProfSpouseAttributes, DmOpsLangProfSpouseCreationAttributes> implements DmOpsLangProfSpouseAttributes {
  public id!: number;
  public leadId!: number;
  public tab!: number | null;
  public langTest!: string | null;
  public testStatus!: string | null;
  public expiryDate!: string | null;
  public testDate!: string | null;
  public testScore!: string | null;
  public rating!: string | null;
  public reading!: string | null;
  public writing!: string | null;
  public listening!: string | null;
  public speaking!: string | null;
  public meetingreq!: string | null;

  public static associate(models: any) {
  }
}

DmOpsLangProfSpouse.init(
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
      allowNull: true
    },
    langTest: {
      type: DataTypes.STRING(255),
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
    modelName: 'DmOpsLangProfSpouse',
    tableName: 'dm_ops_lang_prof_spouse',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsLangProfSpouse };
export type { DmOpsLangProfSpouseAttributes, DmOpsLangProfSpouseCreationAttributes };
