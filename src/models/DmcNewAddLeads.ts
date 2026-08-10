import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcNewAddLeadsAttributes {
  id: number;
  email: string;
  sent: number;
  date: Date;
  fname: string;
}

interface DmcNewAddLeadsCreationAttributes extends Optional<DmcNewAddLeadsAttributes, never> {}

class DmcNewAddLeads extends Model<DmcNewAddLeadsAttributes, DmcNewAddLeadsCreationAttributes> implements DmcNewAddLeadsAttributes {
  declare id: number;
  declare email: string;
  declare sent: number;
  declare date: Date;
  declare fname: string;

  public static associate(models: any) {
  }
}

DmcNewAddLeads.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fname: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmcNewAddLeads',
    tableName: 'dmc_new_add_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcNewAddLeads };
export type { DmcNewAddLeadsAttributes, DmcNewAddLeadsCreationAttributes };
