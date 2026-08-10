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
  declare id: number;
  declare leadId: number;
  declare itaReceDate: string;
  declare itaSubLastDate: string;
  declare itaDocReceDate: string;
  declare itaDocSts: string;
  declare itaSubDate: string;
  declare itaSts: string;
  declare itaAddiReqDate: string;
  declare itaexpdate: string;
  declare itaFile: string;
  declare visaReqDate: string;
  declare passSentDate: string;
  declare passReceDate: string;
  declare visaFile: string;
  declare landDate: string;
  declare landService: string;
  declare landFile: string;
  declare remark: string;
  declare qualification: string;
  declare specialization: string;
  declare university: string;
  declare comments: string;

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
