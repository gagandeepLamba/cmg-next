import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEnquiryAttributes {
  id: number;
  name: string;
  status: number;
}

interface DmEnquiryCreationAttributes extends Optional<DmEnquiryAttributes, 'status'> {}

class DmEnquiry extends Model<DmEnquiryAttributes, DmEnquiryCreationAttributes> implements DmEnquiryAttributes {
  public id!: number;
  public name!: string;
  public status!: number;

  public static associate(models: any) {
  }
}

DmEnquiry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  {
    sequelize,
    modelName: 'DmEnquiry',
    tableName: 'dm_enquiry',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEnquiry };
export type { DmEnquiryAttributes, DmEnquiryCreationAttributes };
