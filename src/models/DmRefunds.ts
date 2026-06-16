import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmRefundsAttributes {
  id: number;
  leadId: number;
  refund_amount: number;
  refund_file: string;
  refund_approved_by: number;
  refund_date: Date;
  refund_department: number;
  revenue_adjust: number;
  revenue_deduct: number;
  refund_approved_date: Date;
  refund_remarks: string;
  refund_type: string;
  created: Date;
  created_by: number;
}

interface DmRefundsCreationAttributes extends Optional<DmRefundsAttributes, never> {}

class DmRefunds extends Model<DmRefundsAttributes, DmRefundsCreationAttributes> implements DmRefundsAttributes {
  public id!: number;
  public leadId!: number;
  public refund_amount!: number;
  public refund_file!: string;
  public refund_approved_by!: number;
  public refund_date!: Date;
  public refund_department!: number;
  public revenue_adjust!: number;
  public revenue_deduct!: number;
  public refund_approved_date!: Date;
  public refund_remarks!: string;
  public refund_type!: string;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmRefunds.init(
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
    refund_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    refund_file: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    refund_approved_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refund_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    refund_department: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    revenue_adjust: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    revenue_deduct: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refund_approved_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    refund_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refund_type: {
      type: DataTypes.STRING(100),
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
    modelName: 'DmRefunds',
    tableName: 'dm_refunds',
    timestamps: false,
    freezeTableName: true,
  });

export { DmRefunds };
export type { DmRefundsAttributes, DmRefundsCreationAttributes };
