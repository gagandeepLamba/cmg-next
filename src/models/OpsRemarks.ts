import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OpsRemarksAttributes {
  id: number;
  leadId: number | null;
  date: string;
  added_by: string | null;
  tab: number | null;
  remark: string | null;
}

interface OpsRemarksCreationAttributes extends Optional<OpsRemarksAttributes, 'leadId' | 'added_by' | 'tab' | 'remark'> {}

class OpsRemarks extends Model<OpsRemarksAttributes, OpsRemarksCreationAttributes> implements OpsRemarksAttributes {
  public id!: number;
  public leadId!: number | null;
  public date!: string;
  public added_by!: string | null;
  public tab!: number | null;
  public remark!: string | null;

  public static associate(models: any) {
  }
}

OpsRemarks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
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
    modelName: 'OpsRemarks',
    tableName: 'ops_remarks',
    timestamps: false,
    freezeTableName: true,
  });

export { OpsRemarks };
export type { OpsRemarksAttributes, OpsRemarksCreationAttributes };
