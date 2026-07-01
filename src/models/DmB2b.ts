import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmB2bAttributes {
  id: number;
  name: string;
  status: number;
  created: Date;
  created_by: number;
}

interface DmB2bCreationAttributes extends Optional<DmB2bAttributes, never> {}

class DmB2b extends Model<DmB2bAttributes, DmB2bCreationAttributes> implements DmB2bAttributes {
  public id!: number;
  public name!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmB2b.init(
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
      allowNull: false
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
    modelName: 'DmB2b',
    tableName: 'dm_b2b',
    timestamps: false,
    freezeTableName: true,
  });

export { DmB2b };
export type { DmB2bAttributes, DmB2bCreationAttributes };
