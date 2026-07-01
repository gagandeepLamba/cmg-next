import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsUpdatedByAttributes {
  id: number;
  lead_id: number;
  counselor_id: number;
  date_time: Date;
}

interface DmOpsUpdatedByCreationAttributes extends Optional<DmOpsUpdatedByAttributes, 'id' | 'date_time'> {}

class DmOpsUpdatedBy extends Model<DmOpsUpdatedByAttributes, DmOpsUpdatedByCreationAttributes> implements DmOpsUpdatedByAttributes {
  public id!: number;
  public lead_id!: number;
  public counselor_id!: number;
  public date_time!: Date;

  public static associate(models: any) {
  }
}

DmOpsUpdatedBy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    counselor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  },
  {
    sequelize,
    modelName: 'DmOpsUpdatedBy',
    tableName: 'dm_ops_updated_by',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsUpdatedBy };
export type { DmOpsUpdatedByAttributes, DmOpsUpdatedByCreationAttributes };
