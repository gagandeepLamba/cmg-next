import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmcLeadReassignmentsAttributes {
  id: number;
  leadId: number;
  fromEmployeeId: number;
  toEmployeeId: number;
  reassignmentType: 'manual' | 'automatic' | 'escalation' | 'transfer' | 'reallocation';
  reason: string;
  previousStatus: string;
  newStatus: string;
  reassignmentDate: Date;
  notes: string | null;
  approvedBy: number | null;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt: Date | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DmcLeadReassignmentsCreationAttributes extends Optional<DmcLeadReassignmentsAttributes, 'id' | 'approvedBy' | 'approvedAt'> {}

class DmcLeadReassignments extends Model<DmcLeadReassignmentsAttributes, DmcLeadReassignmentsCreationAttributes> implements DmcLeadReassignmentsAttributes {
  public id!: number;
  public leadId!: number;
  public fromEmployeeId!: number;
  public toEmployeeId!: number;
  public reassignmentType!: 'manual' | 'automatic' | 'escalation' | 'transfer' | 'reallocation';
  public reason!: string;
  public previousStatus!: string;
  public newStatus!: string;
  public reassignmentDate!: Date;
  public notes!: string | null;
  public approvedBy!: number | null;
  public status!: 'pending' | 'approved' | 'rejected';
  public approvedAt!: Date | null;
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    DmcLeadReassignments.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLead' });
    DmcLeadReassignments.belongsTo(models.DmEmployee, { foreignKey: 'fromEmployeeId', targetKey: 'id', as: 'fromEmployee' });
    DmcLeadReassignments.belongsTo(models.DmEmployee, { foreignKey: 'toEmployeeId', targetKey: 'id', as: 'toEmployee' });
    DmcLeadReassignments.belongsTo(models.DmEmployee, { foreignKey: 'approvedBy', targetKey: 'id', as: 'approvedEmployee' });
    DmcLeadReassignments.belongsTo(models.DmEmployee, { foreignKey: 'createdBy', targetKey: 'id', as: 'createdEmployee' });
  }
}

DmcLeadReassignments.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dmc_forum_leads',
        key: 'id'
      }
    },
    fromEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    toEmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    reassignmentType: {
      type: DataTypes.ENUM('manual', 'automatic', 'escalation', 'transfer', 'reallocation'),
      allowNull: false,
      defaultValue: 'manual'
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    previousStatus: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    newStatus: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    reassignmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'dm_employee',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    approvedAt: {
      type: DataTypes.DATE,
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
    modelName: 'DmcLeadReassignments',
    tableName: 'dm_lead_reassignments',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true,
  }
);

export { DmcLeadReassignments };
export type { DmcLeadReassignmentsAttributes, DmcLeadReassignmentsCreationAttributes };
