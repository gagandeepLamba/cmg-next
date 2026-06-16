import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumEmailLeadsAttributes {
  id: number;
  email: string;
  paidYet: number | null;
  email_sent: number;
  created: Date;
}

interface DmcForumEmailLeadsCreationAttributes extends Optional<DmcForumEmailLeadsAttributes, 'paidYet'> {}

class DmcForumEmailLeads extends Model<DmcForumEmailLeadsAttributes, DmcForumEmailLeadsCreationAttributes> implements DmcForumEmailLeadsAttributes {
  public id!: number;
  public email!: string;
  public paidYet!: number | null;
  public email_sent!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmcForumEmailLeads.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    paidYet: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      defaultValue: 0.00
    },
    email_sent: {
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
    modelName: 'DmcForumEmailLeads',
    tableName: 'dmc_forum_email_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumEmailLeads };
export type { DmcForumEmailLeadsAttributes, DmcForumEmailLeadsCreationAttributes };
