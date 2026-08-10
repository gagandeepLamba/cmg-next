import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJsOpsCompanyInterviewAttributes {
  id: number;
  lead_id: number;
  request_letter_received: number;
  Passport_sent_to_embassy: number;
  passport_received_from_embassy: number;
  document_file: number;
  created_by: number;
  created: number;
}

interface DmJsOpsCompanyInterviewCreationAttributes extends Optional<DmJsOpsCompanyInterviewAttributes, never> {}

class DmJsOpsCompanyInterview extends Model<DmJsOpsCompanyInterviewAttributes, DmJsOpsCompanyInterviewCreationAttributes> implements DmJsOpsCompanyInterviewAttributes {
  declare id: number;
  declare lead_id: number;
  declare request_letter_received: number;
  declare Passport_sent_to_embassy: number;
  declare passport_received_from_embassy: number;
  declare document_file: number;
  declare created_by: number;
  declare created: number;

  public static associate(models: any) {
  }
}

DmJsOpsCompanyInterview.init(
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
    request_letter_received: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Passport_sent_to_embassy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    passport_received_from_embassy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document_file: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmJsOpsCompanyInterview',
    tableName: 'dm_js_ops_company_interview',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJsOpsCompanyInterview };
export type { DmJsOpsCompanyInterviewAttributes, DmJsOpsCompanyInterviewCreationAttributes };
