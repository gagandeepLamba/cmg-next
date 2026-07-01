import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmRegionAttributes {
  id: number;
  name: string;
  status: number;
}

interface DmRegionCreationAttributes extends Optional<DmRegionAttributes, 'status'> {}

class DmRegion extends Model<DmRegionAttributes, DmRegionCreationAttributes> implements DmRegionAttributes {
  public id!: number;
  public name!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmRegion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  {
    sequelize,
    modelName: 'DmRegion',
    tableName: 'dm_region',
    timestamps: false,
    freezeTableName: true,
  });

export { DmRegion };
export type { DmRegionAttributes, DmRegionCreationAttributes };
