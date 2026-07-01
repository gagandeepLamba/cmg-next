import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOldPaymentAttributes {
  id: number;
  agreeNo: string | null;
  recieptno: number;
  paydate: string;
  payCategory: string | null;
  payMethod: string | null;
  payTotal: number;
  discount: number;
  taxAmt: number;
  payBalance: number;
  payAmt: number;
  totPayAmt: number;
  totBalance: number;
  nextPayAmt: number;
  nextPayDate: string;
  demdRemark: string;
}

interface DmOldPaymentCreationAttributes extends Optional<DmOldPaymentAttributes, 'agreeNo' | 'payCategory' | 'payMethod'> {}

class DmOldPayment extends Model<DmOldPaymentAttributes, DmOldPaymentCreationAttributes> implements DmOldPaymentAttributes {
  public id!: number;
  public agreeNo!: string | null;
  public recieptno!: number;
  public paydate!: string;
  public payCategory!: string | null;
  public payMethod!: string | null;
  public payTotal!: number;
  public discount!: number;
  public taxAmt!: number;
  public payBalance!: number;
  public payAmt!: number;
  public totPayAmt!: number;
  public totBalance!: number;
  public nextPayAmt!: number;
  public nextPayDate!: string;
  public demdRemark!: string;

  public static associate(models: any) {
  }
}

DmOldPayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: true
    },
    recieptno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paydate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    payCategory: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    payMethod: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    payTotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    discount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    taxAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payBalance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    payAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    totPayAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    totBalance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    nextPayAmt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    nextPayDate: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    demdRemark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOldPayment',
    tableName: 'dm_old_payment',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOldPayment };
export type { DmOldPaymentAttributes, DmOldPaymentCreationAttributes };
