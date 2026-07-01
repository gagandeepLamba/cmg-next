import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmBatchAttributes {
  id: number;
  batch_name: string;
  batch_number: string;
  created_by: number;
  created: Date;
  vendor_id: number;
  status: number;
}

interface DmBatchCreationAttributes extends Optional<DmBatchAttributes, never> {}

class DmBatch extends Model<DmBatchAttributes, DmBatchCreationAttributes> implements DmBatchAttributes {
  public id!: number;
  public batch_name!: string;
  public batch_number!: string;
  public created_by!: number;
  public created!: Date;
  public vendor_id!: number;
  public status!: number;

  public static associate(models: any) {
  }
}

DmBatch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    batch_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmBatch',
    tableName: 'dm_batch',
    timestamps: false,
    freezeTableName: true,
  });

export { DmBatch };
export type { DmBatchAttributes, DmBatchCreationAttributes };
