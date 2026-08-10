import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface CanadaStatusAttributes {
  id: number;
  leadid: number | null;
  type: string | null;
  status: string | null;
  date: string | null;
  emp: string;
}

interface CanadaStatusCreationAttributes extends Optional<CanadaStatusAttributes, 'leadid' | 'type' | 'status' | 'date'> {}

class CanadaStatus extends Model<CanadaStatusAttributes, CanadaStatusCreationAttributes> implements CanadaStatusAttributes {
  declare id: number;
  declare leadid: number | null;
  declare type: string | null;
  declare status: string | null;
  declare date: string | null;
  declare emp: string;

  public static associate(models: any) {
  }
}

CanadaStatus.init(
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
      type: DataTypes.STRING(40),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    emp: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'CanadaStatus',
    tableName: 'canada_status',
    timestamps: false,
    freezeTableName: true,
  });

export { CanadaStatus };
export type { CanadaStatusAttributes, CanadaStatusCreationAttributes };
