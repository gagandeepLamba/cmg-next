import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface DmcNotificationsAttributes {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  priority: string;
  created_at: Date;
  updated_at: Date;
}

export interface DmcNotificationsCreationAttributes extends Optional<DmcNotificationsAttributes, 'id' | 'is_read' | 'created_at' | 'updated_at'> {}

export class DmcNotifications extends Model<DmcNotificationsAttributes, DmcNotificationsCreationAttributes> implements DmcNotificationsAttributes {
  public id!: number;
  public user_id!: number;
  public type!: string;
  public title!: string;
  public message!: string;
  public is_read!: boolean;
  public priority!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public dmEmployee?: any;

  public static associate(models: any) {
    DmcNotifications.belongsTo(models.DmEmployee, {
      foreignKey: 'user_id',
      as: 'dmEmployee'
    });
  }
}

DmcNotifications.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'normal',
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
    modelName: 'DmcNotifications',
    tableName: 'dmc_notifications',
    timestamps: false,
    freezeTableName: true,
  }
);
