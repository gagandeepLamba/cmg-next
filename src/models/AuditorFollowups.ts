import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AuditorFollowupsAttributes {
  id: number;
  followup_date: Date;
  followup_time: Date;
  followup_remarks: string;
  created: Date;
  created_by: number;
  lead_id: number;
  assign: number;
  na_record: number;
}

interface AuditorFollowupsCreationAttributes extends Optional<AuditorFollowupsAttributes, never> {}

class AuditorFollowups extends Model<AuditorFollowupsAttributes, AuditorFollowupsCreationAttributes> implements AuditorFollowupsAttributes {
  declare id: number;
  declare followup_date: Date;
  declare followup_time: Date;
  declare followup_remarks: string;
  declare created: Date;
  declare created_by: number;
  declare lead_id: number;
  declare assign: number;
  declare na_record: number;

  public static associate(models: any) {
  }
}

AuditorFollowups.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    followup_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    followup_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    followup_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assign: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    na_record: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'AuditorFollowups',
    tableName: 'auditor_followups',
    timestamps: false,
    freezeTableName: true,
  });

export { AuditorFollowups };
export type { AuditorFollowupsAttributes, AuditorFollowupsCreationAttributes };
