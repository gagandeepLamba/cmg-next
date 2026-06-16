import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface EecredentialsOldAttributes {
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
  eesecq4: string | null;
  ee4: string | null;
  recq1: string | null;
  eer1: string | null;
  recq2: string | null;
  eer2: string | null;
  recq3: string | null;
  eer3: string | null;
  recq4: string | null;
  eer4: string | null;
}

interface EecredentialsOldCreationAttributes extends Optional<EecredentialsOldAttributes, 'leadid' | 'eeuid' | 'eeusrpsswrd' | 'eeregemail' | 'eeregpsswrd' | 'eesecq1' | 'ee1' | 'eesecq2' | 'ee2' | 'eesecq3' | 'ee3' | 'eesecq4' | 'ee4' | 'recq1' | 'eer1' | 'recq2' | 'eer2' | 'recq3' | 'eer3' | 'recq4' | 'eer4'> {}

class EecredentialsOld extends Model<EecredentialsOldAttributes, EecredentialsOldCreationAttributes> implements EecredentialsOldAttributes {
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
  public eesecq4!: string | null;
  public ee4!: string | null;
  public recq1!: string | null;
  public eer1!: string | null;
  public recq2!: string | null;
  public eer2!: string | null;
  public recq3!: string | null;
  public eer3!: string | null;
  public recq4!: string | null;
  public eer4!: string | null;

  public static associate(models: any) {
  }
}

EecredentialsOld.init(
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
    eesecq4: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    ee4: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    recq1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    eer1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    recq2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    eer2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    recq3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    eer3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    recq4: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    eer4: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'EecredentialsOld',
    tableName: 'eecredentials_old',
    timestamps: false,
    freezeTableName: true,
  });

export { EecredentialsOld };
export type { EecredentialsOldAttributes, EecredentialsOldCreationAttributes };
