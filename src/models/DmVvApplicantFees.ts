import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmVvApplicantFeesAttributes {
  id: number;
  lead_id: number;
  number_of_applicants: number;
  amount: number;
  tax: number;
  total: number;
  created: Date;
  created_by: number;
}

interface DmVvApplicantFeesCreationAttributes extends Optional<DmVvApplicantFeesAttributes, never> { }

class DmVvApplicantFees extends Model<DmVvApplicantFeesAttributes, DmVvApplicantFeesCreationAttributes> implements DmVvApplicantFeesAttributes {
  declare id: number;
  declare lead_id: number;
  declare number_of_applicants: number;
  declare amount: number;
  declare tax: number;
  declare total: number;
  declare created: Date;
  declare created_by: number;

  public static associate(models: any) {
  }
}

DmVvApplicantFees.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    number_of_applicants: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
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
    modelName: 'DmVvApplicantFees',
    tableName: 'dm_vv_applicant_fees',
    timestamps: false,
    freezeTableName: true,
  });

export { DmVvApplicantFees };
export type { DmVvApplicantFeesAttributes, DmVvApplicantFeesCreationAttributes };
