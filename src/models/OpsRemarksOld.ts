import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OpsRemarksOldAttributes {
  id: number;
  agreeNo: number | null;
  date: string;
  added_by: string | null;
  tab: number | null;
  remark: string | null;
}

interface OpsRemarksOldCreationAttributes extends Optional<OpsRemarksOldAttributes, 'agreeNo' | 'added_by' | 'tab' | 'remark'> {}

class OpsRemarksOld extends Model<OpsRemarksOldAttributes, OpsRemarksOldCreationAttributes> implements OpsRemarksOldAttributes {
  public id!: number;
  public agreeNo!: number | null;
  public date!: string;
  public added_by!: string | null;
  public tab!: number | null;
  public remark!: string | null;

  public static associate(models: any) {
  }
}

OpsRemarksOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    added_by: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'OpsRemarksOld',
    tableName: 'ops_remarks_old',
    timestamps: false,
    freezeTableName: true,
  });

export { OpsRemarksOld };
export type { OpsRemarksOldAttributes, OpsRemarksOldCreationAttributes };
