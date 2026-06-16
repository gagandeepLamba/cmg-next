import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsPolandJolAttributes {
  id: number;
  leadId: number;
  jol_received: string;
  jol_received_date: Date;
  created_by: number;
  created: Date;
  loc_pay: number;
}

interface DmOpsPolandJolCreationAttributes extends Optional<DmOpsPolandJolAttributes, never> {}

class DmOpsPolandJol extends Model<DmOpsPolandJolAttributes, DmOpsPolandJolCreationAttributes> implements DmOpsPolandJolAttributes {
  public id!: number;
  public leadId!: number;
  public jol_received!: string;
  public jol_received_date!: Date;
  public created_by!: number;
  public created!: Date;
  public loc_pay!: number;

  public static associate(models: any) {
  }
}

DmOpsPolandJol.init(
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
    jol_received: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    jol_received_date: {
      type: DataTypes.DATE,
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
    loc_pay: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsPolandJol',
    tableName: 'dm_ops_poland_jol',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsPolandJol };
export type { DmOpsPolandJolAttributes, DmOpsPolandJolCreationAttributes };
