import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface ClientStatusOldAttributes {
  id: number;
  agreeNo: string | null;
  type: string;
  date: string | null;
  status: string | null;
  file: string | null;
  counselorid: number;
}

interface ClientStatusOldCreationAttributes extends Optional<ClientStatusOldAttributes, 'agreeNo' | 'date' | 'status' | 'file'> {}

class ClientStatusOld extends Model<ClientStatusOldAttributes, ClientStatusOldCreationAttributes> implements ClientStatusOldAttributes {
  public id!: number;
  public agreeNo!: string | null;
  public type!: string;
  public date!: string | null;
  public status!: string | null;
  public file!: string | null;
  public counselorid!: number;

  public static associate(models: any) {
  }
}

ClientStatusOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(20),
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
    modelName: 'ClientStatusOld',
    tableName: 'client_status_old',
    timestamps: false,
    freezeTableName: true,
  });

export { ClientStatusOld };
export type { ClientStatusOldAttributes, ClientStatusOldCreationAttributes };
