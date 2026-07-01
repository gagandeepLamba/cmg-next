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
  public id!: number;
  public tab!: number | null;
  public leadId!: number | null;
  public docReceDate!: Date | null;
  public appSubDate!: Date | null;
  public appSub!: string | null;
  public appStatus!: string | null;
  public country!: string | null;
  public num_of_applicants!: string | null;
  public created!: Date | null;
  public created_by!: number | null;

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
