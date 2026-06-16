import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsUpdatedByAttributes {
  lead_id: number;
  counselor_id: number;
  date_time: Date;
}

interface DmOpsUpdatedByCreationAttributes extends Optional<DmOpsUpdatedByAttributes, 'date_time'> {}

class DmOpsUpdatedBy extends Model<DmOpsUpdatedByAttributes, DmOpsUpdatedByCreationAttributes> implements DmOpsUpdatedByAttributes {
  public lead_id!: number;
  public counselor_id!: number;
  public date_time!: Date;

  public static associate(models: any) {
  }
}

DmOpsUpdatedBy.init(
  {
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
