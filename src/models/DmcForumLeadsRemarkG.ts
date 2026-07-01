import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsRemarkGAttributes {
  id: number;
  lead: number;
  date: Date;
  remark: string;
}

interface DmcForumLeadsRemarkGCreationAttributes extends Optional<DmcForumLeadsRemarkGAttributes, never> {}

class DmcForumLeadsRemarkG extends Model<DmcForumLeadsRemarkGAttributes, DmcForumLeadsRemarkGCreationAttributes> implements DmcForumLeadsRemarkGAttributes {
  public id!: number;
  public lead!: number;
  public date!: Date;
  public remark!: string;

  public static associate(models: any) {
  }
}

DmcForumLeadsRemarkG.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsRemarkG',
    tableName: 'dmc_forum_leads_remark_g',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsRemarkG };
export type { DmcForumLeadsRemarkGAttributes, DmcForumLeadsRemarkGCreationAttributes };
