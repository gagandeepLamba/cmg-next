import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientsAttributes {
  id: number;
  leadId: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  dob: Date;
  address: string;
  full_address: string;
  token: string;
  token_validity: Date;
  verify: number;
  password: string;
  hash_password: string;
  status: number;
  accept: number;
  created: Date;
  case_manager: number;
  backend_person: number;
  is_deleted: number;
  city: string;
  nationality: string;
}

interface DmClientsCreationAttributes extends Optional<DmClientsAttributes, never> {}

class DmClients extends Model<DmClientsAttributes, DmClientsCreationAttributes> implements DmClientsAttributes {
  declare id: number;
  declare leadId: number;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare image: string;
  declare dob: Date;
  declare address: string;
  declare full_address: string;
  declare token: string;
  declare token_validity: Date;
  declare verify: number;
  declare password: string;
  declare hash_password: string;
  declare status: number;
  declare accept: number;
  declare created: Date;
  declare case_manager: number;
  declare backend_person: number;
  declare is_deleted: number;
  declare city: string;
  declare nationality: string;

  public static associate(models: any) {
    DmClients.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmClients.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    full_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    token_validity: {
      type: DataTypes.DATE,
      allowNull: false
    },
    verify: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    hash_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    accept: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    case_manager: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    backend_person: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmClients',
    tableName: 'dm_clients',
    timestamps: false,
    freezeTableName: true,
  });

export { DmClients };
export type { DmClientsAttributes, DmClientsCreationAttributes };
