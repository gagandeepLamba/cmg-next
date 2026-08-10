import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export interface DmcNotificationsAttributes {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  related_id: number | null;
  related_type: string | null;
  link: string | null;
  is_read: boolean;
  priority: string;
  created_at: Date;
  updated_at: Date;
}

export interface DmcNotificationsCreationAttributes extends Optional<DmcNotificationsAttributes, 'id' | 'related_id' | 'related_type' | 'link' | 'is_read' | 'created_at' | 'updated_at'> {}

export class DmcNotifications extends Model<DmcNotificationsAttributes, DmcNotificationsCreationAttributes> implements DmcNotificationsAttributes {
  declare id: number;
  declare user_id: number;
  declare type: string;
  declare title: string;
  declare message: string;
  declare related_id: number | null;
  declare related_type: string | null;
  declare link: string | null;
  declare is_read: boolean;
  declare priority: string;
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare dmEmployee?: any;

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
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    related_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
