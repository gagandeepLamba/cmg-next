import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsObservationsAttributes {
  id: number;
  leadId: number;
  sheet: string;
  emirateId: string;
  document: string;
  remark: string;
  os_visit_sheet: string;
  visit_obs_type: string;
  created: Date;
  created_by: number;
}

interface DmcForumLeadsObservationsCreationAttributes extends Optional<DmcForumLeadsObservationsAttributes, never> {}

class DmcForumLeadsObservations extends Model<DmcForumLeadsObservationsAttributes, DmcForumLeadsObservationsCreationAttributes> implements DmcForumLeadsObservationsAttributes {
  public id!: number;
  public leadId!: number;
  public sheet!: string;
  public emirateId!: string;
  public document!: string;
  public remark!: string;
  public os_visit_sheet!: string;
  public visit_obs_type!: string;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
    DmcForumLeadsObservations.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmcForumLeadsObservations.init(
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
    sheet: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    emirateId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    document: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    os_visit_sheet: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    visit_obs_type: {
      type: DataTypes.STRING(100),
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
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsObservations',
    tableName: 'dmc_forum_leads_observations',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsObservations };
export type { DmcForumLeadsObservationsAttributes, DmcForumLeadsObservationsCreationAttributes };
