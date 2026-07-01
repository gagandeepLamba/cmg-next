import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface ClientStatusAttributes {
  id: number;
  leadid: number | null;
  type: string;
  date: string | null;
  status: string | null;
  file: string | null;
  counselorid: number;
}

interface ClientStatusCreationAttributes extends Optional<ClientStatusAttributes, 'leadid' | 'date' | 'status' | 'file'> {}

class ClientStatus extends Model<ClientStatusAttributes, ClientStatusCreationAttributes> implements ClientStatusAttributes {
  public id!: number;
  public leadid!: number | null;
  public type!: string;
  public date!: string | null;
  public status!: string | null;
  public file!: string | null;
  public counselorid!: number;

  public static associate(models: any) {
  }
}

ClientStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    date: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    counselorid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'ClientStatus',
    tableName: 'client_status',
    timestamps: false,
    freezeTableName: true,
  });

export { ClientStatus };
export type { ClientStatusAttributes, ClientStatusCreationAttributes };
