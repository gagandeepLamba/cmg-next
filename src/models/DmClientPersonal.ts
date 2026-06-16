import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientPersonalAttributes {
  id: number;
  leadid: number | null;
  date: string;
  copr: string | null;
  copr_a: string | null;
  client_sheet: string;
  client_sheet_a: number;
  vphoto: string | null;
  vphoto_a: string | null;
  final_visa_docfb: string | null;
  final_visa_docfb_a: string | null;
  final_visa_docfull: string | null;
  final_visa_docfull_a: string | null;
  mcert_re: string | null;
  mcert_re_a: string | null;
  bcert: string | null;
  bcert_a: string | null;
  niddoc: string | null;
  niddoc_a: string | null;
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
  dipthi: number;
}

interface DmClientPersonalCreationAttributes extends Optional<DmClientPersonalAttributes, 'leadid' | 'copr' | 'copr_a' | 'vphoto' | 'vphoto_a' | 'final_visa_docfb' | 'final_visa_docfb_a' | 'final_visa_docfull' | 'final_visa_docfull_a' | 'mcert_re' | 'mcert_re_a' | 'bcert' | 'bcert_a' | 'niddoc' | 'niddoc_a' | 'marraige' | 'marraige_a' | 'ielts' | 'ielts_a' | 'passport' | 'passport_a' | 'passport_new' | 'passport_new_a' | 'pcc' | 'pcc_a' | 'photo' | 'photo_a' | 'resume' | 'resume_a'> {}

class DmClientPersonal extends Model<DmClientPersonalAttributes, DmClientPersonalCreationAttributes> implements DmClientPersonalAttributes {
  public id!: number;
  public leadid!: number | null;
  public date!: string;
  public copr!: string | null;
  public copr_a!: string | null;
  public client_sheet!: string;
  public client_sheet_a!: number;
  public vphoto!: string | null;
  public vphoto_a!: string | null;
  public final_visa_docfb!: string | null;
  public final_visa_docfb_a!: string | null;
  public final_visa_docfull!: string | null;
  public final_visa_docfull_a!: string | null;
  public mcert_re!: string | null;
  public mcert_re_a!: string | null;
  public bcert!: string | null;
  public bcert_a!: string | null;
  public niddoc!: string | null;
  public niddoc_a!: string | null;
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
  public dipthi!: number;

  public static associate(models: any) {
  }
}

DmClientPersonal.init(
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
    date: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    copr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    copr_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    client_sheet: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    client_sheet_a: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vphoto: {
      type: DataTypes.STRING(100),
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
      type: DataTypes.STRING(100),
      allowNull: true
    },
    final_visa_docfull_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    mcert_re: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    mcert_re_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bcert: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bcert_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    niddoc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    niddoc_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    marraige: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    marraige_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ielts: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ielts_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    passport: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    passport_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    passport_new: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    passport_new_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pcc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pcc_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    photo_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    resume: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    resume_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dipthi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmClientPersonal',
    tableName: 'dm_client_personal',
    timestamps: false,
    freezeTableName: true,
  });

export { DmClientPersonal };
export type { DmClientPersonalAttributes, DmClientPersonalCreationAttributes };
