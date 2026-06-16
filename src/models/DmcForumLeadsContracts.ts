import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmcForumLeadsContractsAttributes {
  id: number;
  leadId: number;
  contract: string;
  unsigned_contract: string;
  new_contract: string | null;
  ar_contract: string;
  garys: string | null;
  verify: number;
  remarks: string | null;
  verify_by: number;
  verify_date: Date | null;
  batch_id: number;
  wp_batch_id: number;
  vendor_id: number;
  employer_id: number;
  old_crm_ag_id: number;
  payment_status: number;
}

interface DmcForumLeadsContractsCreationAttributes extends Optional<DmcForumLeadsContractsAttributes, 'new_contract' | 'garys' | 'verify' | 'remarks' | 'verify_by' | 'verify_date'> {}

class DmcForumLeadsContracts extends Model<DmcForumLeadsContractsAttributes, DmcForumLeadsContractsCreationAttributes> implements DmcForumLeadsContractsAttributes {
  public id!: number;
  public leadId!: number;
  public contract!: string;
  public unsigned_contract!: string;
  public new_contract!: string | null;
  public ar_contract!: string;
  public garys!: string | null;
  public verify!: number;
  public remarks!: string | null;
  public verify_by!: number;
  public verify_date!: Date | null;
  public batch_id!: number;
  public wp_batch_id!: number;
  public vendor_id!: number;
  public employer_id!: number;
  public old_crm_ag_id!: number;
  public payment_status!: number;

  public static associate(models: any) {
    DmcForumLeadsContracts.belongsTo(models.DmcForumLeads, { foreignKey: 'leadId', targetKey: 'id', as: 'dmcForumLeads' });
    DmcForumLeadsContracts.hasMany(models.GaryWorkDocs, { foreignKey: 'ag_no', sourceKey: 'id', as: 'garyWorkDocss' });
  }
}

DmcForumLeadsContracts.init(
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
    contract: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    unsigned_contract: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    new_contract: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    ar_contract: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    garys: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    verify: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    verify_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    verify_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wp_batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_crm_ag_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmcForumLeadsContracts',
    tableName: 'dmc_forum_leads_contracts',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeadsContracts };
export type { DmcForumLeadsContractsAttributes, DmcForumLeadsContractsCreationAttributes };
