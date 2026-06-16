import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJsOpsMonthlyStatusAttributes {
  id: number;
  lead_id: number;
  invitation_received_date: number;
  last_date_of_submission: number;
  documents_received_from_client: number;
  documents_status: number;
  application_submission_date: number;
  application_status: number;
  additional_requirement_sent_to_client: number;
  document_file: number;
  created: number;
  created_by: number;
}

interface DmJsOpsMonthlyStatusCreationAttributes extends Optional<DmJsOpsMonthlyStatusAttributes, never> {}

class DmJsOpsMonthlyStatus extends Model<DmJsOpsMonthlyStatusAttributes, DmJsOpsMonthlyStatusCreationAttributes> implements DmJsOpsMonthlyStatusAttributes {
  public id!: number;
  public lead_id!: number;
  public invitation_received_date!: number;
  public last_date_of_submission!: number;
  public documents_received_from_client!: number;
  public documents_status!: number;
  public application_submission_date!: number;
  public application_status!: number;
  public additional_requirement_sent_to_client!: number;
  public document_file!: number;
  public created!: number;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmJsOpsMonthlyStatus.init(
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
    invitation_received_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_date_of_submission: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    documents_received_from_client: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    documents_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    application_submission_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    application_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    additional_requirement_sent_to_client: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document_file: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmJsOpsMonthlyStatus',
    tableName: 'dm_js_ops_monthly_status',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJsOpsMonthlyStatus };
export type { DmJsOpsMonthlyStatusAttributes, DmJsOpsMonthlyStatusCreationAttributes };
