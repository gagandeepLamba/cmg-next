import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmSvCredentialsAttributes {
  id: number;
  leadid: number | null;
  eeuid: string | null;
  eeusrpsswrd: string | null;
  eeregemail: string | null;
  eeregpsswrd: string | null;
  eesecq1: string | null;
  ee1: string | null;
  eesecq2: string | null;
  ee2: string | null;
  eesecq3: string | null;
  ee3: string | null;
  created: Date;
  created_by: number;
}

interface DmSvCredentialsCreationAttributes extends Optional<DmSvCredentialsAttributes, 'leadid' | 'eeuid' | 'eeusrpsswrd' | 'eeregemail' | 'eeregpsswrd' | 'eesecq1' | 'ee1' | 'eesecq2' | 'ee2' | 'eesecq3' | 'ee3'> {}

class DmSvCredentials extends Model<DmSvCredentialsAttributes, DmSvCredentialsCreationAttributes> implements DmSvCredentialsAttributes {
  public id!: number;
  public leadid!: number | null;
  public eeuid!: string | null;
  public eeusrpsswrd!: string | null;
  public eeregemail!: string | null;
  public eeregpsswrd!: string | null;
  public eesecq1!: string | null;
  public ee1!: string | null;
  public eesecq2!: string | null;
  public ee2!: string | null;
  public eesecq3!: string | null;
  public ee3!: string | null;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmSvCredentials.init(
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
    eeuid: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eeusrpsswrd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eeregemail: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eeregpsswrd: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    eesecq1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ee1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    eesecq2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ee2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    eesecq3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ee3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmSvCredentials',
    tableName: 'dm_sv_credentials',
    timestamps: false,
    freezeTableName: true,
  });

export { DmSvCredentials };
export type { DmSvCredentialsAttributes, DmSvCredentialsCreationAttributes };
