import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface DmcMeetingSchedulesAttributes {
  id: number;
  lead_id: number;
  user_id: number;
  meeting_date: Date;
  meeting_type: string;
  location?: string;
  agenda?: string;
  status: string;
  priority: string;
  notes?: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DmcMeetingSchedulesCreationAttributes extends Optional<DmcMeetingSchedulesAttributes, 'id' | 'location' | 'agenda' | 'status' | 'priority' | 'notes' | 'completed_at' | 'created_at' | 'updated_at'> {}

export class DmcMeetingSchedules extends Model<DmcMeetingSchedulesAttributes, DmcMeetingSchedulesCreationAttributes> implements DmcMeetingSchedulesAttributes {
  public id!: number;
  public lead_id!: number;
  public user_id!: number;
  public meeting_date!: Date;
  public meeting_type!: string;
  public location?: string;
  public agenda?: string;
  public status!: string;
  public priority!: string;
  public notes?: string;
  public completed_at?: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public dmcForumLead?: any;
  public dmEmployee?: any;

  public static associate(models: any) {
    DmcMeetingSchedules.belongsTo(models.DmcForumLeads, {
      foreignKey: 'lead_id',
      as: 'dmcForumLead'
    });
    
    DmcMeetingSchedules.belongsTo(models.DmEmployee, {
      foreignKey: 'user_id',
      as: 'dmEmployee'
    });
  }
}

DmcMeetingSchedules.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meeting_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    meeting_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    agenda: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'normal',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'DmcMeetingSchedules',
    tableName: 'dmc_meeting_schedules',
    timestamps: false,
    freezeTableName: true,
  }
);
