import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEuropeCasesAttributes {
  id: number;
  lead_id: number;
  registration: number;
  jol: number;
  loc: number;
  wp: number;
  wp_hc: number;
  dl: number;
  payment_status_jol: number;
  payment_status_loc: number;
  payment_status_wp: number;
  created_by: number;
  created: Date;
  ops: number;
  sales: number;
  reject: number;
  approve: number;
}

interface DmEuropeCasesCreationAttributes extends Optional<DmEuropeCasesAttributes, never> {}

class DmEuropeCases extends Model<DmEuropeCasesAttributes, DmEuropeCasesCreationAttributes> implements DmEuropeCasesAttributes {
  public id!: number;
  public lead_id!: number;
  public registration!: number;
  public jol!: number;
  public loc!: number;
  public wp!: number;
  public wp_hc!: number;
  public dl!: number;
  public payment_status_jol!: number;
  public payment_status_loc!: number;
  public payment_status_wp!: number;
  public created_by!: number;
  public created!: Date;
  public ops!: number;
  public sales!: number;
  public reject!: number;
  public approve!: number;

  public static associate(models: any) {
    DmEuropeCases.belongsTo(models.DmcForumLeads, { foreignKey: 'lead_id', targetKey: 'id', as: 'dmcForumLeads' });
  }
}

DmEuropeCases.init(
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
    registration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wp_hc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dl: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_status_jol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_status_loc: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_status_wp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ops: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sales: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reject: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approve: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEuropeCases',
    tableName: 'dm_europe_cases',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEuropeCases };
export type { DmEuropeCasesAttributes, DmEuropeCasesCreationAttributes };
