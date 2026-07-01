import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmVendorsAttributes {
  id: number;
  name: string;
  status: number;
  created_by: number;
  created: Date;
}

interface DmVendorsCreationAttributes extends Optional<DmVendorsAttributes, 'status'> {}

class DmVendors extends Model<DmVendorsAttributes, DmVendorsCreationAttributes> implements DmVendorsAttributes {
  public id!: number;
  public name!: string;
  public status!: number;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmVendors.init(
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmVendors',
    tableName: 'dm_vendors',
    timestamps: false,
    freezeTableName: true,
  });

export { DmVendors };
export type { DmVendorsAttributes, DmVendorsCreationAttributes };
