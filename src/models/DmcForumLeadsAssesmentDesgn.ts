import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsAssesmentDesgnAttributes {
  id: number;
  skillId: number;
  leadId: number;
  fromEmpRecMonth: string | null;
  fromEmpRecYear: string | null;
  toEmpRecMonth: string | null;
  toEmpRecYear: string | null;
  empRecName: string | null;
  empRecDesign: string | null;
  empRecType: string | null;
}

interface DmcForumLeadsAssesmentDesgnCreationAttributes extends Optional<DmcForumLeadsAssesmentDesgnAttributes, 'fromEmpRecMonth' | 'fromEmpRecYear' | 'toEmpRecMonth' | 'toEmpRecYear' | 'empRecName' | 'empRecDesign' | 'empRecType'> {}

class DmcForumLeadsAssesmentDesgn extends Model<DmcForumLeadsAssesmentDesgnAttributes, DmcForumLeadsAssesmentDesgnCreationAttributes> implements DmcForumLeadsAssesmentDesgnAttributes {
  public id!: number;
  public skillId!: number;
  public leadId!: number;
  public fromEmpRecMonth!: string | null;
  public fromEmpRecYear!: string | null;
  public toEmpRecMonth!: string | null;
  public toEmpRecYear!: string | null;
  public empRecName!: string | null;
  public empRecDesign!: string | null;
  public empRecType!: string | null;

  public static associate(models: any) {
    DmcForumLeadsAssesmentDesgn.belongsTo(models.DmcForumLeadsAssesments, { foreignKey: 'skillId', targetKey: 'Id', as: 'dmcForumLeadsAssesments' });
    DmcForumLeadsAssesmentDesgn.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmcForumLeadsAssesmentDesgn.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fromEmpRecMonth: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    fromEmpRecYear: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    toEmpRecMonth: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    toEmpRecYear: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    empRecName: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    empRecDesign: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    empRecType: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsAssesmentDesgn',
    tableName: 'dmc_forum_leads_assesment_desgn',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsAssesmentDesgn };
export type { DmcForumLeadsAssesmentDesgnAttributes, DmcForumLeadsAssesmentDesgnCreationAttributes };
