import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface AuditorMeetingsAttributes {
  id: number;
  meeting_date: Date;
  meeting_time: Date;
  meeting_remarks: string;
  created: Date;
  created_by: number;
  lead_id: number;
  assign: number;
  na_record: number;
  followup_meet: number;
  mail_sent: number;
}

interface AuditorMeetingsCreationAttributes extends Optional<AuditorMeetingsAttributes, never> {}

class AuditorMeetings extends Model<AuditorMeetingsAttributes, AuditorMeetingsCreationAttributes> implements AuditorMeetingsAttributes {
  public id!: number;
  public meeting_date!: Date;
  public meeting_time!: Date;
  public meeting_remarks!: string;
  public created!: Date;
  public created_by!: number;
  public lead_id!: number;
  public assign!: number;
  public na_record!: number;
  public followup_meet!: number;
  public mail_sent!: number;

  public static associate(models: any) {
  }
}

AuditorMeetings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    meeting_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    meeting_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    meeting_remarks: {
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
    followup_meet: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mail_sent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'AuditorMeetings',
    tableName: 'auditor_meetings',
    timestamps: false,
    freezeTableName: true,
  });

export { AuditorMeetings };
export type { AuditorMeetingsAttributes, AuditorMeetingsCreationAttributes };
