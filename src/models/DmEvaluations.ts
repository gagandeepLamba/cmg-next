import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEvaluationsAttributes {
  id: number;
  client_name: string;
  dob: Date;
  contact: string;
  location: string;
  marrital_status: string;
  experience: string;
  email_address: string;
  occupation_code: string;
  skill_type: string;
  age_marks: number;
  qualification_marks: number;
  work_exp_marks: number;
  lang_ab_marks: number;
  french_marks: number;
  adap_marks: number;
  arranged_marks: number;
  created: Date;
  created_by: number;
  deleted: number;
}

interface DmEvaluationsCreationAttributes extends Optional<DmEvaluationsAttributes, never> {}

class DmEvaluations extends Model<DmEvaluationsAttributes, DmEvaluationsCreationAttributes> implements DmEvaluationsAttributes {
  public id!: number;
  public client_name!: string;
  public dob!: Date;
  public contact!: string;
  public location!: string;
  public marrital_status!: string;
  public experience!: string;
  public email_address!: string;
  public occupation_code!: string;
  public skill_type!: string;
  public age_marks!: number;
  public qualification_marks!: number;
  public work_exp_marks!: number;
  public lang_ab_marks!: number;
  public french_marks!: number;
  public adap_marks!: number;
  public arranged_marks!: number;
  public created!: Date;
  public created_by!: number;
  public deleted!: number;

  public static associate(models: any) {
  }
}

DmEvaluations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    marrital_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    experience: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    occupation_code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    skill_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    age_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qualification_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    work_exp_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lang_ab_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    french_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    adap_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    arranged_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEvaluations',
    tableName: 'dm_evaluations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEvaluations };
export type { DmEvaluationsAttributes, DmEvaluationsCreationAttributes };
