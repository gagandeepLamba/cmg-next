import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmWelcomeEmailDocsAttributes {
  id: number;
  lead_id: number;
  docs: string;
  docs_for: string;
  created_by: number;
  created: Date;
}

interface DmWelcomeEmailDocsCreationAttributes extends Optional<DmWelcomeEmailDocsAttributes, never> {}

class DmWelcomeEmailDocs extends Model<DmWelcomeEmailDocsAttributes, DmWelcomeEmailDocsCreationAttributes> implements DmWelcomeEmailDocsAttributes {
  public id!: number;
  public lead_id!: number;
  public docs!: string;
  public docs_for!: string;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmWelcomeEmailDocs.init(
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
    docs: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    docs_for: {
      type: DataTypes.STRING(255),
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
  },
  {
    sequelize,
    modelName: 'DmWelcomeEmailDocs',
    tableName: 'dm_welcome_email_docs',
    timestamps: false,
    freezeTableName: true,
  });

export { DmWelcomeEmailDocs };
export type { DmWelcomeEmailDocsAttributes, DmWelcomeEmailDocsCreationAttributes };
