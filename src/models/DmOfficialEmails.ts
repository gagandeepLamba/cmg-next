import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOfficialEmailsAttributes {
  id: number;
  branch: number;
  frontend: string;
  backend: string;
  status: number;
  created: Date;
}

interface DmOfficialEmailsCreationAttributes extends Optional<DmOfficialEmailsAttributes, never> {}

class DmOfficialEmails extends Model<DmOfficialEmailsAttributes, DmOfficialEmailsCreationAttributes> implements DmOfficialEmailsAttributes {
  public id!: number;
  public branch!: number;
  public frontend!: string;
  public backend!: string;
  public status!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmOfficialEmails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    frontend: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    backend: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
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
    modelName: 'DmOfficialEmails',
    tableName: 'dm_official_emails',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOfficialEmails };
export type { DmOfficialEmailsAttributes, DmOfficialEmailsCreationAttributes };
