import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcOpportunityActivitiesAttributes {
  id: number;
  opportunityId: number;
  activityType: string;
  activityTitle: string;
  description: string;
  activityDate: Date;
  duration: number;
  outcome: string;
  nextStep: string;
  assignedTo: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  attendees: string;
  notes: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcOpportunityActivitiesCreationAttributes extends Optional<DmcOpportunityActivitiesAttributes, 'id'> {}

class DmcOpportunityActivities extends Model<DmcOpportunityActivitiesAttributes, DmcOpportunityActivitiesCreationAttributes> implements DmcOpportunityActivitiesAttributes {
  public id!: number;
  public opportunityId!: number;
  public activityType!: string;
  public activityTitle!: string;
  public description!: string;
  public activityDate!: Date;
  public duration!: number;
  public outcome!: string;
  public nextStep!: string;
  public assignedTo!: number;
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public status!: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  public location!: string;
  public attendees!: string;
  public notes!: string;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcOpportunityActivities.belongsTo(models.DmcOpportunities, { foreignKey: 'opportunityId', targetKey: 'id', as: 'dmcOpportunity' });
    DmcOpportunityActivities.belongsTo(models.DmEmployee, { foreignKey: 'assignedTo', targetKey: 'id', as: 'assignedEmployee' });
    DmcOpportunityActivities.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
  }
}

DmcOpportunityActivities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    opportunityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dmc_opportunities',
        key: 'id'
      }
    },
    activityType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    activityTitle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activityDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    outcome: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nextStep: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    attendees: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'DmcOpportunityActivities',
    tableName: 'dmc_opportunity_activities',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcOpportunityActivities };
export type { DmcOpportunityActivitiesAttributes, DmcOpportunityActivitiesCreationAttributes };
