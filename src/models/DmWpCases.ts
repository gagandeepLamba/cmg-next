import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmWpCasesAttributes {
  id: number;
  vendor_id: number;
  approve: number;
  stage_2_approve: number;
  stage_3_approve: number;
  stage_2_denied: number;
  stage_3_denied: number;
  declined: number;
  ag_no: number;
  amount: number;
  amount_stage_2: number;
  amount_stage_3: number;
  created: Date;
  created_by: number;
  batch_id: number;
  account_approve: number;
  account_approve_two: number;
  account_approve_three: number;
  ops_approve: number;
  ops_approve_two: number;
  ops_approve_three: number;
  stage_2_file: string;
  stage_3_file: string;
  rejection: string;
}

interface DmWpCasesCreationAttributes extends Optional<DmWpCasesAttributes, never> {}

class DmWpCases extends Model<DmWpCasesAttributes, DmWpCasesCreationAttributes> implements DmWpCasesAttributes {
  public id!: number;
  public vendor_id!: number;
  public approve!: number;
  public stage_2_approve!: number;
  public stage_3_approve!: number;
  public stage_2_denied!: number;
  public stage_3_denied!: number;
  public declined!: number;
  public ag_no!: number;
  public amount!: number;
  public amount_stage_2!: number;
  public amount_stage_3!: number;
  public created!: Date;
  public created_by!: number;
  public batch_id!: number;
  public account_approve!: number;
  public account_approve_two!: number;
  public account_approve_three!: number;
  public ops_approve!: number;
  public ops_approve_two!: number;
  public ops_approve_three!: number;
  public stage_2_file!: string;
  public stage_3_file!: string;
  public rejection!: string;

  public static associate(models: any) {
  }
}

DmWpCases.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approve: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_2_approve: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_3_approve: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_2_denied: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_3_denied: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    declined: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ag_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    amount_stage_2: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    amount_stage_3: {
      type: DataTypes.DECIMAL(10,2),
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
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_approve: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_approve_two: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_approve_three: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ops_approve: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ops_approve_two: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ops_approve_three: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stage_2_file: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    stage_3_file: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    rejection: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmWpCases',
    tableName: 'dm_wp_cases',
    timestamps: false,
    freezeTableName: true,
  });

export { DmWpCases };
export type { DmWpCasesAttributes, DmWpCasesCreationAttributes };
