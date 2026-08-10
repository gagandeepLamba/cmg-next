import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmJobSearchQualificationAttributes {
  id: number;
  leadid: number | null;
  qualifctn: string | null;
  specilization: string | null;
  university: string | null;
  assesment_body: string;
  type: string;
  rating: string | null;
  created_by: Date;
  created: number;
}

interface DmJobSearchQualificationCreationAttributes extends Optional<DmJobSearchQualificationAttributes, 'leadid' | 'qualifctn' | 'specilization' | 'university' | 'rating'> {}

class DmJobSearchQualification extends Model<DmJobSearchQualificationAttributes, DmJobSearchQualificationCreationAttributes> implements DmJobSearchQualificationAttributes {
  declare id: number;
  declare leadid: number | null;
  declare qualifctn: string | null;
  declare specilization: string | null;
  declare university: string | null;
  declare assesment_body: string;
  declare type: string;
  declare rating: string | null;
  declare created_by: Date;
  declare created: number;

  public static associate(models: any) {
  }
}

DmJobSearchQualification.init(
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
    qualifctn: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    specilization: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    university: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    assesment_body: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rating: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    created_by: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmJobSearchQualification',
    tableName: 'dm_job_search_qualification',
    timestamps: false,
    freezeTableName: true,
  });

export { DmJobSearchQualification };
export type { DmJobSearchQualificationAttributes, DmJobSearchQualificationCreationAttributes };
