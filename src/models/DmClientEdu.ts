import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmClientEduAttributes {
  id: number;
  leadid: number | null;
  date: string;
  con_mark_sheet_m: string | null;
  con_mark_sheet_m_a: string | null;
  con_mark_sheet_b: string | null;
  con_mark_sheet_b_a: string | null;
  ind_mark_sheet_m: string | null;
  ind_mark_sheet_m_a: string | null;
  revised_eca_m: string | null;
  revised_eca_m_a: string | null;
  revised_eca_b: string | null;
  revised_eca_b_a: string | null;
  revised_wes_eca_m: string | null;
  revised_wes_eca_m_a: string | null;
  conv_cert_m: string | null;
  conv_cert_m_a: string | null;
  revised_wes_eca_b: string | null;
  revised_wes_eca_b_a: string | null;
  eca_m: string | null;
  eca_m_a: string | null;
  conv_cert_b: string | null;
  conv_cert_b_a: string | null;
  ind_mark_sheet_b: string | null;
  ind_mark_sheet_b_a: string | null;
  bach_seal_trans_unv: string | null;
  bach_seal_trans_unv_a: string | null;
  eca_b: string | null;
  eca_b_a: string | null;
  intermediate: string | null;
  intermediate_a: string | null;
  ssc: string | null;
  ssc_a: string | null;
  dipthi: number;
}

interface DmClientEduCreationAttributes extends Optional<DmClientEduAttributes, 'leadid' | 'con_mark_sheet_m' | 'con_mark_sheet_m_a' | 'con_mark_sheet_b' | 'con_mark_sheet_b_a' | 'ind_mark_sheet_m' | 'ind_mark_sheet_m_a' | 'revised_eca_m' | 'revised_eca_m_a' | 'revised_eca_b' | 'revised_eca_b_a' | 'revised_wes_eca_m' | 'revised_wes_eca_m_a' | 'conv_cert_m' | 'conv_cert_m_a' | 'revised_wes_eca_b' | 'revised_wes_eca_b_a' | 'eca_m' | 'eca_m_a' | 'conv_cert_b' | 'conv_cert_b_a' | 'ind_mark_sheet_b' | 'ind_mark_sheet_b_a' | 'bach_seal_trans_unv' | 'bach_seal_trans_unv_a' | 'eca_b' | 'eca_b_a' | 'intermediate' | 'intermediate_a' | 'ssc' | 'ssc_a'> {}

class DmClientEdu extends Model<DmClientEduAttributes, DmClientEduCreationAttributes> implements DmClientEduAttributes {
  declare id: number;
  declare leadid: number | null;
  declare date: string;
  declare con_mark_sheet_m: string | null;
  declare con_mark_sheet_m_a: string | null;
  declare con_mark_sheet_b: string | null;
  declare con_mark_sheet_b_a: string | null;
  declare ind_mark_sheet_m: string | null;
  declare ind_mark_sheet_m_a: string | null;
  declare revised_eca_m: string | null;
  declare revised_eca_m_a: string | null;
  declare revised_eca_b: string | null;
  declare revised_eca_b_a: string | null;
  declare revised_wes_eca_m: string | null;
  declare revised_wes_eca_m_a: string | null;
  declare conv_cert_m: string | null;
  declare conv_cert_m_a: string | null;
  declare revised_wes_eca_b: string | null;
  declare revised_wes_eca_b_a: string | null;
  declare eca_m: string | null;
  declare eca_m_a: string | null;
  declare conv_cert_b: string | null;
  declare conv_cert_b_a: string | null;
  declare ind_mark_sheet_b: string | null;
  declare ind_mark_sheet_b_a: string | null;
  declare bach_seal_trans_unv: string | null;
  declare bach_seal_trans_unv_a: string | null;
  declare eca_b: string | null;
  declare eca_b_a: string | null;
  declare intermediate: string | null;
  declare intermediate_a: string | null;
  declare ssc: string | null;
  declare ssc_a: string | null;
  declare dipthi: number;

  public static associate(models: any) {
  }
}

DmClientEdu.init(
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
    date: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    con_mark_sheet_m: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    con_mark_sheet_m_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    con_mark_sheet_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    con_mark_sheet_b_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ind_mark_sheet_m: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ind_mark_sheet_m_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    revised_eca_m: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    revised_eca_m_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    revised_eca_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    revised_eca_b_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    revised_wes_eca_m: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    revised_wes_eca_m_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    conv_cert_m: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    conv_cert_m_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    revised_wes_eca_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    revised_wes_eca_b_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    eca_m: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    eca_m_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    conv_cert_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    conv_cert_b_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ind_mark_sheet_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ind_mark_sheet_b_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bach_seal_trans_unv: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bach_seal_trans_unv_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    eca_b: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    eca_b_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    intermediate: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    intermediate_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ssc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ssc_a: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dipthi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmClientEdu',
    tableName: 'dm_client_edu',
    timestamps: false,
    freezeTableName: true,
  });

export { DmClientEdu };
export type { DmClientEduAttributes, DmClientEduCreationAttributes };
