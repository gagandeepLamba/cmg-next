import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface BusinessAssPaymentAttributes {
  id: number;
  leadid: number | null;
  paydate: string;
  payMethod: string | null;
  payTotal: number;
  discount: number;
  taxAmt: number;
  payBalance: number;
  payAmt: number;
  totPayAmt: number;
  demdRemark: string;
}

interface BusinessAssPaymentCreationAttributes extends Optional<BusinessAssPaymentAttributes, 'leadid' | 'payMethod'> {}

class BusinessAssPayment extends Model<BusinessAssPaymentAttributes, BusinessAssPaymentCreationAttributes> implements BusinessAssPaymentAttributes {
  public id!: number;
  public leadid!: number | null;
  public paydate!: string;
  public payMethod!: string | null;
  public payTotal!: number;
  public discount!: number;
  public taxAmt!: number;
  public payBalance!: number;
  public payAmt!: number;
  public totPayAmt!: number;
  public demdRemark!: string;

  public static associate(models: any) {
  }
}

BusinessAssPayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paydate: {
      type: DataTypes.STRING(50),
      allowNull: false
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
    demdRemark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'BusinessAssPayment',
    tableName: 'business_ass_payment',
    timestamps: false,
    freezeTableName: true,
  });

export { BusinessAssPayment };
export type { BusinessAssPaymentAttributes, BusinessAssPaymentCreationAttributes };
