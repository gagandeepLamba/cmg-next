import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientPersonalOldAttributes {
  id: number;
  agreeNo: string | null;
  copr: string | null;
  copr_a: string | null;
  vphoto: string | null;
  vphoto_a: string | null;
  final_visa_docfb: string | null;
  final_visa_docfb_a: string | null;
  final_visa_docfull: string | null;
  final_visa_docfull_a: string | null;
  mcert_re: string | null;
  mcert_re_a: string;
  bcert: string | null;
  bcert_a: string;
  niddoc: string | null;
  niddoc_a: string;
  marraige: string | null;
  marraige_a: string | null;
  ielts: string | null;
  ielts_a: string | null;
  passport: string | null;
  passport_a: string | null;
  passport_new: string | null;
  passport_new_a: string | null;
  pcc: string | null;
  pcc_a: string | null;
  photo: string | null;
  photo_a: string | null;
  resume: string | null;
  resume_a: string | null;
  date: Date;
  dipthi: number;
  harish: number;
  terence: number;
}

interface DmClientPersonalOldCreationAttributes extends Optional<DmClientPersonalOldAttributes, 'agreeNo' | 'copr' | 'copr_a' | 'vphoto' | 'vphoto_a' | 'final_visa_docfb' | 'final_visa_docfb_a' | 'final_visa_docfull' | 'final_visa_docfull_a' | 'mcert_re' | 'bcert' | 'niddoc' | 'marraige' | 'marraige_a' | 'ielts' | 'ielts_a' | 'passport' | 'passport_a' | 'passport_new' | 'passport_new_a' | 'pcc' | 'pcc_a' | 'photo' | 'photo_a' | 'resume' | 'resume_a'> {}

class DmClientPersonalOld extends Model<DmClientPersonalOldAttributes, DmClientPersonalOldCreationAttributes> implements DmClientPersonalOldAttributes {
  public id!: number;
  public agreeNo!: string | null;
  public copr!: string | null;
  public copr_a!: string | null;
  public vphoto!: string | null;
  public vphoto_a!: string | null;
  public final_visa_docfb!: string | null;
  public final_visa_docfb_a!: string | null;
  public final_visa_docfull!: string | null;
  public final_visa_docfull_a!: string | null;
  public mcert_re!: string | null;
  public mcert_re_a!: string;
  public bcert!: string | null;
  public bcert_a!: string;
  public niddoc!: string | null;
  public niddoc_a!: string;
  public marraige!: string | null;
  public marraige_a!: string | null;
  public ielts!: string | null;
  public ielts_a!: string | null;
  public passport!: string | null;
  public passport_a!: string | null;
  public passport_new!: string | null;
  public passport_new_a!: string | null;
  public pcc!: string | null;
  public pcc_a!: string | null;
  public photo!: string | null;
  public photo_a!: string | null;
  public resume!: string | null;
  public resume_a!: string | null;
  public date!: Date;
  public dipthi!: number;
  public harish!: number;
  public terence!: number;

  public static associate(models: any) {
  }
}

DmClientPersonalOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: true
    },
    copr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    copr_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    vphoto: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    vphoto_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    final_visa_docfb: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    final_visa_docfb_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    final_visa_docfull: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    final_visa_docfull_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mcert_re: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mcert_re_a: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    bcert: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bcert_a: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    niddoc: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    niddoc_a: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    marraige: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    marraige_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ielts: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ielts_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    passport: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    passport_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    passport_new: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    passport_new_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pcc: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pcc_a: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    photo_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    resume: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    resume_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dipthi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    harish: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    terence: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmClientPersonalOld',
    tableName: 'dm_client_personal_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmClientPersonalOld };
export type { DmClientPersonalOldAttributes, DmClientPersonalOldCreationAttributes };
