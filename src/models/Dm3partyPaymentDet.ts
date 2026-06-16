import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface Dm3partyPaymentDetAttributes {
  id: number;
  payId: number;
  particular: string;
  amount: number;
}

interface Dm3partyPaymentDetCreationAttributes extends Optional<Dm3partyPaymentDetAttributes, never> {}

class Dm3partyPaymentDet extends Model<Dm3partyPaymentDetAttributes, Dm3partyPaymentDetCreationAttributes> implements Dm3partyPaymentDetAttributes {
  public id!: number;
  public payId!: number;
  public particular!: string;
  public amount!: number;

  public static associate(models: any) {
    Dm3partyPaymentDet.belongsTo(models.Dm3partyPayment, { foreignKey: 'payId', targetKey: 'id', as: 'dm3partyPayment' });
  }
}

Dm3partyPaymentDet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    payId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    particular: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Dm3partyPaymentDet',
    tableName: 'dm_3party_payment_det',
    timestamps: false,
    freezeTableName: true,
  });

export { Dm3partyPaymentDet };
export type { Dm3partyPaymentDetAttributes, Dm3partyPaymentDetCreationAttributes };
