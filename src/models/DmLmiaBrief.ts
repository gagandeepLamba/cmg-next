import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmLmiaBriefAttributes {
  id: number;
  leadId: number;
  third_party_amt: number;
  dm_amt: number;
  tax_amt: number;
  refund_amt: number;
  status: number;
  created_by: number;
  created: Date;
}

interface DmLmiaBriefCreationAttributes extends Optional<DmLmiaBriefAttributes, never> {}

class DmLmiaBrief extends Model<DmLmiaBriefAttributes, DmLmiaBriefCreationAttributes> implements DmLmiaBriefAttributes {
  public id!: number;
  public leadId!: number;
  public third_party_amt!: number;
  public dm_amt!: number;
  public tax_amt!: number;
  public refund_amt!: number;
  public status!: number;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmLmiaBrief.init(
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
    third_party_amt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    dm_amt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    tax_amt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    refund_amt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize,
    modelName: 'DmLmiaBrief',
    tableName: 'dm_lmia_brief',
    timestamps: false,
    freezeTableName: true,
  });

export { DmLmiaBrief };
export type { DmLmiaBriefAttributes, DmLmiaBriefCreationAttributes };
