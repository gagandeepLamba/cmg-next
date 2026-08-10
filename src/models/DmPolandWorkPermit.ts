import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmPolandWorkPermitAttributes {
  id: number;
  leadId: number;
  docs_received: Date;
  designation: string;
  company_name: string;
  wp_renewal: string;
  wp_payment: number;
  job_applied_date: Date;
  job_offer_rec_date: Date;
  job_status: string;
  job_hard_status: string;
  work_permit_rec_date: Date;
  work_permit_hard_rec_date: Date;
  app_country_name: number;
  salary: string;
  created: Date;
  created_by: number;
  final_pay: number;
}

interface DmPolandWorkPermitCreationAttributes extends Optional<DmPolandWorkPermitAttributes, never> {}

class DmPolandWorkPermit extends Model<DmPolandWorkPermitAttributes, DmPolandWorkPermitCreationAttributes> implements DmPolandWorkPermitAttributes {
  declare id: number;
  declare leadId: number;
  declare docs_received: Date;
  declare designation: string;
  declare company_name: string;
  declare wp_renewal: string;
  declare wp_payment: number;
  declare job_applied_date: Date;
  declare job_offer_rec_date: Date;
  declare job_status: string;
  declare job_hard_status: string;
  declare work_permit_rec_date: Date;
  declare work_permit_hard_rec_date: Date;
  declare app_country_name: number;
  declare salary: string;
  declare created: Date;
  declare created_by: number;
  declare final_pay: number;

  public static associate(models: any) {
  }
}

DmPolandWorkPermit.init(
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
    docs_received: {
      type: DataTypes.DATE,
      allowNull: false
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    wp_renewal: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    wp_payment: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    job_applied_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    job_offer_rec_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    job_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    job_hard_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    work_permit_rec_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    work_permit_hard_rec_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    app_country_name: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    salary: {
      type: DataTypes.STRING(255),
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
    final_pay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmPolandWorkPermit',
    tableName: 'dm_poland_work_permit',
    timestamps: false,
    freezeTableName: true,
  });

export { DmPolandWorkPermit };
export type { DmPolandWorkPermitAttributes, DmPolandWorkPermitCreationAttributes };
