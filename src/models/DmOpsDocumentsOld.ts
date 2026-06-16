import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsDocumentsOldAttributes {
  id: number;
  opsId: number;
  agreeNo: string;
  tab: number;
  name: string;
  file: string;
  created: Date;
}

interface DmOpsDocumentsOldCreationAttributes extends Optional<DmOpsDocumentsOldAttributes, never> {}

class DmOpsDocumentsOld extends Model<DmOpsDocumentsOldAttributes, DmOpsDocumentsOldCreationAttributes> implements DmOpsDocumentsOldAttributes {
  public id!: number;
  public opsId!: number;
  public agreeNo!: string;
  public tab!: number;
  public name!: string;
  public file!: string;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmOpsDocumentsOld.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    opsId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agreeNo: {
      type: DataTypes.STRING(111),
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    file: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsDocumentsOld',
    tableName: 'dm_ops_documents_old',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsDocumentsOld };
export type { DmOpsDocumentsOldAttributes, DmOpsDocumentsOldCreationAttributes };
