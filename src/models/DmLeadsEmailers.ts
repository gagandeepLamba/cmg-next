import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLeadsEmailersAttributes {
  id: number;
  email: string;
  name: string;
  branch: number;
  created: Date;
  sent: number;
  month: string;
}

interface DmLeadsEmailersCreationAttributes extends Optional<DmLeadsEmailersAttributes, never> {}

class DmLeadsEmailers extends Model<DmLeadsEmailersAttributes, DmLeadsEmailersCreationAttributes> implements DmLeadsEmailersAttributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public branch!: number;
  public created!: Date;
  public sent!: number;
  public month!: string;

  public static associate(models: any) {
  }
}

DmLeadsEmailers.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmLeadsEmailers',
    tableName: 'dm_leads_emailers',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLeadsEmailers };
export type { DmLeadsEmailersAttributes, DmLeadsEmailersCreationAttributes };
