import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmPnpOldAttributes {
  id: number;
  opsid: number;
  agreeNo: string;
  pnp: string;
  subdate: string;
  expdate: string;
  status: string;
  pts: string;
  eoisubdate: string;
  noiexpdate: string;
  noisubdate: string;
  eoiexpdate: string;
  noirecdate: string;
  nomawdate: string;
  nomexpdate: string;
}

interface DmPnpOldCreationAttributes extends Optional<DmPnpOldAttributes, never> {}

class DmPnpOld extends Model<DmPnpOldAttributes, DmPnpOldCreationAttributes> implements DmPnpOldAttributes {
  public id!: number;
  public opsid!: number;
  public agreeNo!: string;
  public pnp!: string;
  public subdate!: string;
  public expdate!: string;
  public status!: string;
  public pts!: string;
  public eoisubdate!: string;
  public noiexpdate!: string;
  public noisubdate!: string;
  public eoiexpdate!: string;
  public noirecdate!: string;
  public nomawdate!: string;
  public nomexpdate!: string;

  public static associate(models: any) {
  }
}

DmPnpOld.init(
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
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: false
    },
    pnp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    subdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    expdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pts: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    eoisubdate: {
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
    eoiexpdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    noirecdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nomawdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nomexpdate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmPnpOld',
    tableName: 'dm_pnp_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmPnpOld };
export type { DmPnpOldAttributes, DmPnpOldCreationAttributes };
