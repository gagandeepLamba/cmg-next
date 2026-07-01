import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsSkillCanadaItaAttributes {
  id: number;
  leadId: number;
  itaReceDate: string;
  itaSubLastDate: string;
  itaDocReceDate: string;
  itaDocSts: string;
  itaSubDate: string;
  itaSts: string;
  itaAddiReqDate: string;
  itaexpdate: string;
  itaFile: string;
  visaReqDate: string;
  passSentDate: string;
  passReceDate: string;
  visaFile: string;
  landDate: string;
  landService: string;
  landFile: string;
  remark: string;
  qualification: string;
  specialization: string;
  university: string;
  comments: string;
}

interface DmOpsSkillCanadaItaCreationAttributes extends Optional<DmOpsSkillCanadaItaAttributes, never> {}

class DmOpsSkillCanadaIta extends Model<DmOpsSkillCanadaItaAttributes, DmOpsSkillCanadaItaCreationAttributes> implements DmOpsSkillCanadaItaAttributes {
  public id!: number;
  public leadId!: number;
  public itaReceDate!: string;
  public itaSubLastDate!: string;
  public itaDocReceDate!: string;
  public itaDocSts!: string;
  public itaSubDate!: string;
  public itaSts!: string;
  public itaAddiReqDate!: string;
  public itaexpdate!: string;
  public itaFile!: string;
  public visaReqDate!: string;
  public passSentDate!: string;
  public passReceDate!: string;
  public visaFile!: string;
  public landDate!: string;
  public landService!: string;
  public landFile!: string;
  public remark!: string;
  public qualification!: string;
  public specialization!: string;
  public university!: string;
  public comments!: string;

  public static associate(models: any) {
  }
}

DmOpsSkillCanadaIta.init(
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
    itaReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaSubLastDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaDocReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaDocSts: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    itaSubDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaSts: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    itaAddiReqDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    itaexpdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    itaFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    visaReqDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passSentDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    passReceDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    visaFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    landDate: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    landService: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    landFile: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    qualification: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    specialization: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    university: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsSkillCanadaIta',
    tableName: 'dm_ops_skill_canada_ita',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsSkillCanadaIta };
export type { DmOpsSkillCanadaItaAttributes, DmOpsSkillCanadaItaCreationAttributes };
