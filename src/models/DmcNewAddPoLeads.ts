import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcNewAddPoLeadsAttributes {
  id: number;
  email: string;
  sent: number;
  date: Date;
  name: string;
}

interface DmcNewAddPoLeadsCreationAttributes extends Optional<DmcNewAddPoLeadsAttributes, never> {}

class DmcNewAddPoLeads extends Model<DmcNewAddPoLeadsAttributes, DmcNewAddPoLeadsCreationAttributes> implements DmcNewAddPoLeadsAttributes {
  public id!: number;
  public email!: string;
  public sent!: number;
  public date!: Date;
  public name!: string;

  public static associate(models: any) {
  }
}

DmcNewAddPoLeads.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmcNewAddPoLeads',
    tableName: 'dmc_new_add_po_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcNewAddPoLeads };
export type { DmcNewAddPoLeadsAttributes, DmcNewAddPoLeadsCreationAttributes };
