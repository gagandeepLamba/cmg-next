import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJsOpsNominationAttributes {
  id: number;
  lead_id: number;
  date_of_landing: number;
  service: number;
  document_file: number;
  created: number;
  created_by: number;
  tab: number;
}

interface DmJsOpsNominationCreationAttributes extends Optional<DmJsOpsNominationAttributes, never> {}

class DmJsOpsNomination extends Model<DmJsOpsNominationAttributes, DmJsOpsNominationCreationAttributes> implements DmJsOpsNominationAttributes {
  public id!: number;
  public lead_id!: number;
  public date_of_landing!: number;
  public service!: number;
  public document_file!: number;
  public created!: number;
  public created_by!: number;
  public tab!: number;

  public static associate(models: any) {
  }
}

DmJsOpsNomination.init(
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
    date_of_landing: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document_file: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tab: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmJsOpsNomination',
    tableName: 'dm_js_ops_nomination',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJsOpsNomination };
export type { DmJsOpsNominationAttributes, DmJsOpsNominationCreationAttributes };
