import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';

interface DmSourceAttributes {
  id: number;
  name: string;
  status: number;
}

interface DmSourceCreationAttributes extends Optional<DmSourceAttributes, 'id' | 'status'> {}

class DmSource extends Model<DmSourceAttributes, DmSourceCreationAttributes> implements DmSourceAttributes {
  public id!: number;
  public name!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmSource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: 'DmSource',
    tableName: 'dm_source',
    timestamps: false,
    freezeTableName: true,
  });

export { DmSource };
export type { DmSourceAttributes, DmSourceCreationAttributes };
