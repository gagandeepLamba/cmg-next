import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmWelcomeEmailAttributes {
  id: number;
  lead_id: number;
  remarks: string;
  teer_code: string;
  subject: string;
  email_from: string;
  to: string;
  cc: string;
  bcc: string;
  created_by: number;
  created: Date;
}

interface DmWelcomeEmailCreationAttributes extends Optional<DmWelcomeEmailAttributes, never> {}

class DmWelcomeEmail extends Model<DmWelcomeEmailAttributes, DmWelcomeEmailCreationAttributes> implements DmWelcomeEmailAttributes {
  declare id: number;
  declare lead_id: number;
  declare remarks: string;
  declare teer_code: string;
  declare subject: string;
  declare email_from: string;
  declare to: string;
  declare cc: string;
  declare bcc: string;
  declare created_by: number;
  declare created: Date;

  public static associate(models: any) {
  }
}

DmWelcomeEmail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    teer_code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email_from: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    to: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    bcc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmWelcomeEmail',
    tableName: 'dm_welcome_email',
    timestamps: false,
    freezeTableName: true,
  });

export { DmWelcomeEmail };
export type { DmWelcomeEmailAttributes, DmWelcomeEmailCreationAttributes };
