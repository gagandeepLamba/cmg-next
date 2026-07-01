import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface DmcFollowUpRemindersAttributes {
  id: number;
  lead_id: number;
  user_id: number;
  reminder_date: Date;
  message: string;
  status: string;
  priority: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DmcFollowUpRemindersCreationAttributes extends Optional<DmcFollowUpRemindersAttributes, 'id' | 'status' | 'priority' | 'completed_at' | 'created_at' | 'updated_at'> {}

export class DmcFollowUpReminders extends Model<DmcFollowUpRemindersAttributes, DmcFollowUpRemindersCreationAttributes> implements DmcFollowUpRemindersAttributes {
  public id!: number;
  public lead_id!: number;
  public user_id!: number;
  public reminder_date!: Date;
  public message!: string;
  public status!: string;
  public priority!: string;
  public completed_at?: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public dmcForumLead?: any;
  public dmEmployee?: any;

  public static associate(models: any) {
    DmcFollowUpReminders.belongsTo(models.DmcForumLeads, {
      foreignKey: 'lead_id',
      as: 'dmcForumLead'
    });
    
    DmcFollowUpReminders.belongsTo(models.DmEmployee, {
      foreignKey: 'user_id',
      as: 'dmEmployee'
    });
  }
}

DmcFollowUpReminders.init(
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
    reminder_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'medium',
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
    modelName: 'DmcFollowUpReminders',
    tableName: 'dmc_follow_up_reminders',
    timestamps: false,
    freezeTableName: true,
  }
);
