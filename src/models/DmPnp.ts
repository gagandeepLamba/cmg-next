import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmPnpAttributes {
  id: number;
  opsid: number;
  leadid: number;
  pnp: string;
  pts: number;
  eoisubdate: string;
  eoiexpdate: string;
  noiexpdate: string;
  noisubdate: string;
  noirecdate: string;
  nomawdate: string;
  nomexpdate: string;
  status: string;
}

interface DmPnpCreationAttributes extends Optional<DmPnpAttributes, never> {}

class DmPnp extends Model<DmPnpAttributes, DmPnpCreationAttributes> implements DmPnpAttributes {
  declare id: number;
  declare opsid: number;
  declare leadid: number;
  declare pnp: string;
  declare pts: number;
  declare eoisubdate: string;
  declare eoiexpdate: string;
  declare noiexpdate: string;
  declare noisubdate: string;
  declare noirecdate: string;
  declare nomawdate: string;
  declare nomexpdate: string;
  declare status: string;

  public static associate(models: any) {
    DmPnp.belongsTo(models.DmcForumLeads, { foreignKey: 'leadid', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmPnp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    opsid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    leadid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pnp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eoisubdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    eoiexpdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    noiexpdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    noisubdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    noirecdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nomawdate: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    nomexpdate: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmPnp',
    tableName: 'dm_pnp',
    timestamps: false,
    freezeTableName: true,
  });

export { DmPnp };
export type { DmPnpAttributes, DmPnpCreationAttributes };
