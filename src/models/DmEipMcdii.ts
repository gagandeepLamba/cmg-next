import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEipMcdiiAttributes {
  id: number;
  leadId: string;
  tab: number;
  eligibility: string;
  doc_received: string;
  doc_rece_date: Date;
  noc: string;
  eoi_sub_date: Date;
  eoi_status: string;
  exploratory_visit_status: string;
  exploratory_visit_date: Date;
}

interface DmEipMcdiiCreationAttributes extends Optional<DmEipMcdiiAttributes, never> {}

class DmEipMcdii extends Model<DmEipMcdiiAttributes, DmEipMcdiiCreationAttributes> implements DmEipMcdiiAttributes {
  declare id: number;
  declare leadId: string;
  declare tab: number;
  declare eligibility: string;
  declare doc_received: string;
  declare doc_rece_date: Date;
  declare noc: string;
  declare eoi_sub_date: Date;
  declare eoi_status: string;
  declare exploratory_visit_status: string;
  declare exploratory_visit_date: Date;

  public static associate(models: any) {
  }
}

DmEipMcdii.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eligibility: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    doc_received: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    doc_rece_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    noc: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    eoi_sub_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    eoi_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    exploratory_visit_status: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    exploratory_visit_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEipMcdii',
    tableName: 'dm_eip_mcdii',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEipMcdii };
export type { DmEipMcdiiAttributes, DmEipMcdiiCreationAttributes };
