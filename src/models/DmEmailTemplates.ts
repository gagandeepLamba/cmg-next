import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmEmailTemplatesAttributes {
  id: number;
  program: string;
  template: string;
  created: Date;
  status: number;
  ops: number;
  sales: number;
  created_by: number;
}

interface DmEmailTemplatesCreationAttributes extends Optional<DmEmailTemplatesAttributes, never> {}

class DmEmailTemplates extends Model<DmEmailTemplatesAttributes, DmEmailTemplatesCreationAttributes> implements DmEmailTemplatesAttributes {
  public id!: number;
  public program!: string;
  public template!: string;
  public created!: Date;
  public status!: number;
  public ops!: number;
  public sales!: number;
  public created_by!: number;

  public static associate(models: any) {
  }
}

DmEmailTemplates.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    program: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    template: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmEmailTemplates',
    tableName: 'dm_email_templates',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmailTemplates };
export type { DmEmailTemplatesAttributes, DmEmailTemplatesCreationAttributes };
