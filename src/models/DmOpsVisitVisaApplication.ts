import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsVisitVisaApplicationAttributes {
  id: number;
  tab: number | null;
  leadId: number | null;
  docReceDate: Date | null;
  appSubDate: Date | null;
  appSub: string | null;
  appStatus: string | null;
  country: string | null;
  num_of_applicants: string | null;
  created: Date | null;
  created_by: number | null;
}

interface DmOpsVisitVisaApplicationCreationAttributes extends Optional<DmOpsVisitVisaApplicationAttributes, 'tab' | 'leadId' | 'docReceDate' | 'appSubDate' | 'appSub' | 'appStatus' | 'country' | 'num_of_applicants' | 'created' | 'created_by'> {}

class DmOpsVisitVisaApplication extends Model<DmOpsVisitVisaApplicationAttributes, DmOpsVisitVisaApplicationCreationAttributes> implements DmOpsVisitVisaApplicationAttributes {
  declare id: number;
  declare tab: number | null;
  declare leadId: number | null;
  declare docReceDate: Date | null;
  declare appSubDate: Date | null;
  declare appSub: string | null;
  declare appStatus: string | null;
  declare country: string | null;
  declare num_of_applicants: string | null;
  declare created: Date | null;
  declare created_by: number | null;

  public static associate(models: any) {
  }
}

DmOpsVisitVisaApplication.init(
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
    docReceDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appSubDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appSub: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    appStatus: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    num_of_applicants: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    modelName: 'DmOpsVisitVisaApplication',
    tableName: 'dm_ops_visit_visa_application',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsVisitVisaApplication };
export type { DmOpsVisitVisaApplicationAttributes, DmOpsVisitVisaApplicationCreationAttributes };
