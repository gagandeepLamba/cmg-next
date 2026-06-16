import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsAssesmentsAttributes {
  Id: number;
  leadId: number;
  Type: string | null;
  cob: string | null;
  phOffice: string | null;
  marStatus: string | null;
  haveChild: string | null;
  noOfChild: string | null;
  spfname: string | null;
  spmname: string | null;
  splname: string | null;
  spgender: string | null;
  spdob: Date | null;
  spcob: string | null;
  spcitizenof: string | null;
  spaddress: string | null;
  spmobile: string | null;
  spphHome: string | null;
  spphOffice: string | null;
  spemail: string | null;
  relName: string | null;
  reRelation: string | null;
  reCountry: string | null;
  reAddress: string | null;
  reStatus: string | null;
  moveAsset: string | null;
  inmoveAsset: string | null;
  interestIn: string | null;
  ownership: string | null;
  document: string | null;
  assesment: string | null;
}

interface DmcForumLeadsAssesmentsCreationAttributes extends Optional<DmcForumLeadsAssesmentsAttributes, 'Type' | 'cob' | 'phOffice' | 'marStatus' | 'haveChild' | 'noOfChild' | 'spfname' | 'spmname' | 'splname' | 'spgender' | 'spdob' | 'spcob' | 'spcitizenof' | 'spaddress' | 'spmobile' | 'spphHome' | 'spphOffice' | 'spemail' | 'relName' | 'reRelation' | 'reCountry' | 'reAddress' | 'reStatus' | 'moveAsset' | 'inmoveAsset' | 'interestIn' | 'ownership' | 'document' | 'assesment'> {}

class DmcForumLeadsAssesments extends Model<DmcForumLeadsAssesmentsAttributes, DmcForumLeadsAssesmentsCreationAttributes> implements DmcForumLeadsAssesmentsAttributes {
  public Id!: number;
  public leadId!: number;
  public Type!: string | null;
  public cob!: string | null;
  public phOffice!: string | null;
  public marStatus!: string | null;
  public haveChild!: string | null;
  public noOfChild!: string | null;
  public spfname!: string | null;
  public spmname!: string | null;
  public splname!: string | null;
  public spgender!: string | null;
  public spdob!: Date | null;
  public spcob!: string | null;
  public spcitizenof!: string | null;
  public spaddress!: string | null;
  public spmobile!: string | null;
  public spphHome!: string | null;
  public spphOffice!: string | null;
  public spemail!: string | null;
  public relName!: string | null;
  public reRelation!: string | null;
  public reCountry!: string | null;
  public reAddress!: string | null;
  public reStatus!: string | null;
  public moveAsset!: string | null;
  public inmoveAsset!: string | null;
  public interestIn!: string | null;
  public ownership!: string | null;
  public document!: string | null;
  public assesment!: string | null;

  public static associate(models: any) {
    DmcForumLeadsAssesments.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
    DmcForumLeadsAssesments.hasMany(models.DmcForumLeadsAssesmentDesgn, { foreignKey: 'skillId', sourceKey: 'Id', as: 'dmcForumLeadsAssesmentDesgns' });
    DmcForumLeadsAssesments.hasMany(models.DmcForumLeadsAssesmentEdu, { foreignKey: 'skillId', sourceKey: 'Id', as: 'dmcForumLeadsAssesmentEdus' });
  }
}

DmcForumLeadsAssesments.init(
  {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    cob: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    phOffice: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    marStatus: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    haveChild: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    noOfChild: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    spfname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spmname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    splname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spgender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spdob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    spcob: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spcitizenof: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spaddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    spmobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spphHome: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spphOffice: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    spemail: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    relName: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    reRelation: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    reCountry: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    reAddress: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    reStatus: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    moveAsset: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    inmoveAsset: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    interestIn: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    ownership: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assesment: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsAssesments',
    tableName: 'dmc_forum_leads_assesments',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsAssesments };
export type { DmcForumLeadsAssesmentsAttributes, DmcForumLeadsAssesmentsCreationAttributes };
