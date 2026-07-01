import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcAuhEmailLeadsAttributes {
  id: number;
  email: string;
  email_sent: number;
  created: Date;
}

interface DmcAuhEmailLeadsCreationAttributes extends Optional<DmcAuhEmailLeadsAttributes, never> {}

class DmcAuhEmailLeads extends Model<DmcAuhEmailLeadsAttributes, DmcAuhEmailLeadsCreationAttributes> implements DmcAuhEmailLeadsAttributes {
  public id!: number;
  public email!: string;
  public email_sent!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmcAuhEmailLeads.init(
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
    modelName: 'DmcAuhEmailLeads',
    tableName: 'dmc_auh_email_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcAuhEmailLeads };
export type { DmcAuhEmailLeadsAttributes, DmcAuhEmailLeadsCreationAttributes };
