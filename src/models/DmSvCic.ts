import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmSvCicAttributes {
  id: number;
  leadId: number;
  tab: number;
  doc_rec_date: Date;
  docs_status: string;
  nationality: string;
  application_sub_date: Date;
  status: string;
  created: Date;
  created_by: number;
}

interface DmSvCicCreationAttributes extends Optional<DmSvCicAttributes, never> {}

class DmSvCic extends Model<DmSvCicAttributes, DmSvCicCreationAttributes> implements DmSvCicAttributes {
  public id!: number;
  public leadId!: number;
  public tab!: number;
  public doc_rec_date!: Date;
  public docs_status!: string;
  public nationality!: string;
  public application_sub_date!: Date;
  public status!: string;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmSvCic.init(
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
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doc_rec_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    docs_status: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    application_sub_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
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
    modelName: 'DmSvCic',
    tableName: 'dm_sv_cic',
    timestamps: false,
    freezeTableName: true,
  });

export { DmSvCic };
export type { DmSvCicAttributes, DmSvCicCreationAttributes };
