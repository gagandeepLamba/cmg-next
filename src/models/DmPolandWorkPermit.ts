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
  public id!: number;
  public leadId!: number;
  public docs_received!: Date;
  public designation!: string;
  public company_name!: string;
  public wp_renewal!: string;
  public wp_payment!: number;
  public job_applied_date!: Date;
  public job_offer_rec_date!: Date;
  public job_status!: string;
  public job_hard_status!: string;
  public work_permit_rec_date!: Date;
  public work_permit_hard_rec_date!: Date;
  public app_country_name!: number;
  public salary!: string;
  public created!: Date;
  public created_by!: number;
  public final_pay!: number;

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
