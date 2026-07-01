import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface Dm3partyPaymentOldAttributes {
  id: number;
  agreeNo: string;
  date: Date;
  amount: number;
  Tax: number;
  payMethod: string;
  particular: string;
}

interface Dm3partyPaymentOldCreationAttributes extends Optional<Dm3partyPaymentOldAttributes, 'Tax'> {}

class Dm3partyPaymentOld extends Model<Dm3partyPaymentOldAttributes, Dm3partyPaymentOldCreationAttributes> implements Dm3partyPaymentOldAttributes {
  public id!: number;
  public agreeNo!: string;
  public date!: Date;
  public amount!: number;
  public Tax!: number;
  public payMethod!: string;
  public particular!: string;

  public static associate(models: any) {
  }
}

Dm3partyPaymentOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    Tax: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    payMethod: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    particular: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Dm3partyPaymentOld',
    tableName: 'dm_3party_payment_old',
    timestamps: false,
    freezeTableName: true,
  });

export { Dm3partyPaymentOld };
export type { Dm3partyPaymentOldAttributes, Dm3partyPaymentOldCreationAttributes };
