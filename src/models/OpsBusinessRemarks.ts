import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OpsBusinessRemarksAttributes {
  id: number;
  leadId: number | null;
  date: string;
  added_by: string | null;
  tab: number | null;
  remark: string | null;
  followup_remark_date: Date;
}

interface OpsBusinessRemarksCreationAttributes extends Optional<OpsBusinessRemarksAttributes, 'leadId' | 'added_by' | 'tab' | 'remark'> {}

class OpsBusinessRemarks extends Model<OpsBusinessRemarksAttributes, OpsBusinessRemarksCreationAttributes> implements OpsBusinessRemarksAttributes {
  public id!: number;
  public leadId!: number | null;
  public date!: string;
  public added_by!: string | null;
  public tab!: number | null;
  public remark!: string | null;
  public followup_remark_date!: Date;

  public static associate(models: any) {
  }
}

OpsBusinessRemarks.init(
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
    followup_remark_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'OpsBusinessRemarks',
    tableName: 'ops_business_remarks',
    timestamps: false,
    freezeTableName: true,
  });

export { OpsBusinessRemarks };
export type { OpsBusinessRemarksAttributes, OpsBusinessRemarksCreationAttributes };
