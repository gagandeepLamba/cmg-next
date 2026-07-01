import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsPolandApplicationAttributes {
  id: number;
  tab: number | null;
  leadId: number | null;
  docSubDate: Date | null;
  status: string | null;
  visaStatus: string | null;
  agent: string;
  amount_to_agent: number;
  appointment_status: string;
  appointment_date: Date;
  place: string;
  created: Date | null;
  created_by: number | null;
}

interface DmOpsPolandApplicationCreationAttributes extends Optional<DmOpsPolandApplicationAttributes, 'tab' | 'leadId' | 'docSubDate' | 'status' | 'visaStatus' | 'created' | 'created_by'> {}

class DmOpsPolandApplication extends Model<DmOpsPolandApplicationAttributes, DmOpsPolandApplicationCreationAttributes> implements DmOpsPolandApplicationAttributes {
  public id!: number;
  public tab!: number | null;
  public leadId!: number | null;
  public docSubDate!: Date | null;
  public status!: string | null;
  public visaStatus!: string | null;
  public agent!: string;
  public amount_to_agent!: number;
  public appointment_status!: string;
  public appointment_date!: Date;
  public place!: string;
  public created!: Date | null;
  public created_by!: number | null;

  public static associate(models: any) {
  }
}

DmOpsPolandApplication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    docSubDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    visaStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    agent: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    amount_to_agent: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    appointment_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    place: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'DmOpsPolandApplication',
    tableName: 'dm_ops_poland_application',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsPolandApplication };
export type { DmOpsPolandApplicationAttributes, DmOpsPolandApplicationCreationAttributes };
