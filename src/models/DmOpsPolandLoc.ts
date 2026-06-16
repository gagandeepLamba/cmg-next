import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsPolandLocAttributes {
  id: number;
  leadId: number;
  loc_received: string;
  loc_received_date: Date;
  loc_designation: string;
  loc_company_name: string;
  loc_salary: string;
  handover_status: string;
  handover_date: Date;
  created_by: number;
  created: Date;
  wp_pay: number;
}

interface DmOpsPolandLocCreationAttributes extends Optional<DmOpsPolandLocAttributes, never> {}

class DmOpsPolandLoc extends Model<DmOpsPolandLocAttributes, DmOpsPolandLocCreationAttributes> implements DmOpsPolandLocAttributes {
  public id!: number;
  public leadId!: number;
  public loc_received!: string;
  public loc_received_date!: Date;
  public loc_designation!: string;
  public loc_company_name!: string;
  public loc_salary!: string;
  public handover_status!: string;
  public handover_date!: Date;
  public created_by!: number;
  public created!: Date;
  public wp_pay!: number;

  public static associate(models: any) {
  }
}

DmOpsPolandLoc.init(
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
    loc_received: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    loc_received_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    loc_designation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    loc_company_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    loc_salary: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    handover_status: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    handover_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    wp_pay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsPolandLoc',
    tableName: 'dm_ops_poland_loc',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsPolandLoc };
export type { DmOpsPolandLocAttributes, DmOpsPolandLocCreationAttributes };
