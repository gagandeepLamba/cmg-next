import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsLmiaAttributes {
  id: number;
  leadId: number;
  noc: Date;
  lmia_submit_date: Date;
  lmia_status: string;
  date_of_approved: Date;
  created: Date;
  created_by: number;
}

interface DmOpsLmiaCreationAttributes extends Optional<DmOpsLmiaAttributes, never> {}

class DmOpsLmia extends Model<DmOpsLmiaAttributes, DmOpsLmiaCreationAttributes> implements DmOpsLmiaAttributes {
  public id!: number;
  public leadId!: number;
  public noc!: Date;
  public lmia_submit_date!: Date;
  public lmia_status!: string;
  public date_of_approved!: Date;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmOpsLmia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    noc: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lmia_submit_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lmia_status: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    date_of_approved: {
      type: DataTypes.DATE,
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
    modelName: 'DmOpsLmia',
    tableName: 'dm_ops_lmia',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsLmia };
export type { DmOpsLmiaAttributes, DmOpsLmiaCreationAttributes };
