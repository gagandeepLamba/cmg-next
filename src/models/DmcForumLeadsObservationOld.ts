import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsObservationOldAttributes {
  id: number;
  agreeNo: string;
  obs_sheet: string;
  agreement_sheet: string;
}

interface DmcForumLeadsObservationOldCreationAttributes extends Optional<DmcForumLeadsObservationOldAttributes, never> {}

class DmcForumLeadsObservationOld extends Model<DmcForumLeadsObservationOldAttributes, DmcForumLeadsObservationOldCreationAttributes> implements DmcForumLeadsObservationOldAttributes {
  public id!: number;
  public agreeNo!: string;
  public obs_sheet!: string;
  public agreement_sheet!: string;

  public static associate(models: any) {
  }
}

DmcForumLeadsObservationOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: false
    },
    obs_sheet: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    agreement_sheet: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsObservationOld',
    tableName: 'dmc_forum_leads_observation_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsObservationOld };
export type { DmcForumLeadsObservationOldAttributes, DmcForumLeadsObservationOldCreationAttributes };
