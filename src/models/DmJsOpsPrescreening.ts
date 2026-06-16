import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJsOpsPrescreeningAttributes {
  id: number;
  lead_id: number;
  prescreening_date: Date;
  prescreening_status: string;
  interview_mode: string;
  created: Date;
  created_by: number;
}

interface DmJsOpsPrescreeningCreationAttributes extends Optional<DmJsOpsPrescreeningAttributes, never> {}

class DmJsOpsPrescreening extends Model<DmJsOpsPrescreeningAttributes, DmJsOpsPrescreeningCreationAttributes> implements DmJsOpsPrescreeningAttributes {
  public id!: number;
  public lead_id!: number;
  public prescreening_date!: Date;
  public prescreening_status!: string;
  public interview_mode!: string;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmJsOpsPrescreening.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prescreening_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    prescreening_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    interview_mode: {
      type: DataTypes.STRING(20),
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
    modelName: 'DmJsOpsPrescreening',
    tableName: 'dm_js_ops_prescreening',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJsOpsPrescreening };
export type { DmJsOpsPrescreeningAttributes, DmJsOpsPrescreeningCreationAttributes };
