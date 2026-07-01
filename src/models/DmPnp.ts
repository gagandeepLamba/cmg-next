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
  public id!: number;
  public opsid!: number;
  public leadid!: number;
  public pnp!: string;
  public pts!: number;
  public eoisubdate!: string;
  public eoiexpdate!: string;
  public noiexpdate!: string;
  public noisubdate!: string;
  public noirecdate!: string;
  public nomawdate!: string;
  public nomexpdate!: string;
  public status!: string;

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
