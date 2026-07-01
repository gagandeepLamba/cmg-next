import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmNewClientAttributes {
  id: number;
  email: string;
  email_sent: number;
}

interface DmNewClientCreationAttributes extends Optional<DmNewClientAttributes, never> {}

class DmNewClient extends Model<DmNewClientAttributes, DmNewClientCreationAttributes> implements DmNewClientAttributes {
  public id!: number;
  public email!: string;
  public email_sent!: number;

  public static associate(models: any) {
  }
}

DmNewClient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email_sent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmNewClient',
    tableName: 'dm_new_client',
    timestamps: false,
    freezeTableName: true,
  });

export { DmNewClient };
export type { DmNewClientAttributes, DmNewClientCreationAttributes };
