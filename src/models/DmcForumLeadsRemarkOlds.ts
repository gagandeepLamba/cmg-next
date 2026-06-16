import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsRemarkOldsAttributes {
  id: number;
  agreeNo: string;
  date: Date;
  remark: string;
  emp: string;
}

interface DmcForumLeadsRemarkOldsCreationAttributes extends Optional<DmcForumLeadsRemarkOldsAttributes, never> {}

class DmcForumLeadsRemarkOlds extends Model<DmcForumLeadsRemarkOldsAttributes, DmcForumLeadsRemarkOldsCreationAttributes> implements DmcForumLeadsRemarkOldsAttributes {
  public id!: number;
  public agreeNo!: string;
  public date!: Date;
  public remark!: string;
  public emp!: string;

  public static associate(models: any) {
  }
}

DmcForumLeadsRemarkOlds.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(100),
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
    emp: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsRemarkOlds',
    tableName: 'dmc_forum_leads_remark_olds',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsRemarkOlds };
export type { DmcForumLeadsRemarkOldsAttributes, DmcForumLeadsRemarkOldsCreationAttributes };
