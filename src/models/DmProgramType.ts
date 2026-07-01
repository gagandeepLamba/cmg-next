import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmProgramTypeAttributes {
  id: number;
  type: string;
  status: number;
  created: Date;
  created_by: number;
}

interface DmProgramTypeCreationAttributes extends Optional<DmProgramTypeAttributes, never> {}

class DmProgramType extends Model<DmProgramTypeAttributes, DmProgramTypeCreationAttributes> implements DmProgramTypeAttributes {
  public id!: number;
  public type!: string;
  public status!: number;
  public created!: Date;
  public created_by!: number;

  public static associate(models: any) {
    DmProgramType.hasMany(models.DmCountriesTypeProgram, { foreignKey: 'type', sourceKey: 'id', as: 'countryPrograms' });
  }
}

DmProgramType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmProgramType',
    tableName: 'dm_program_type',
    timestamps: false,
    freezeTableName: true,
  });

export { DmProgramType };
export type { DmProgramTypeAttributes, DmProgramTypeCreationAttributes };
