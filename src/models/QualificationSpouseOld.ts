import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface QualificationSpouseOldAttributes {
  id: number;
  leadid: number | null;
  qualifctn: string | null;
  specilization: string | null;
  university: string | null;
  assesment_body: string;
  type: string;
  rating: string | null;
}

interface QualificationSpouseOldCreationAttributes extends Optional<QualificationSpouseOldAttributes, 'leadid' | 'qualifctn' | 'specilization' | 'university' | 'rating'> {}

class QualificationSpouseOld extends Model<QualificationSpouseOldAttributes, QualificationSpouseOldCreationAttributes> implements QualificationSpouseOldAttributes {
  public id!: number;
  public leadid!: number | null;
  public qualifctn!: string | null;
  public specilization!: string | null;
  public university!: string | null;
  public assesment_body!: string;
  public type!: string;
  public rating!: string | null;

  public static associate(models: any) {
  }
}

QualificationSpouseOld.init(
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
  },
  {
    sequelize,
    modelName: 'QualificationSpouseOld',
    tableName: 'qualification_spouse_old',
    timestamps: false,
    freezeTableName: true,
  });

export { QualificationSpouseOld };
export type { QualificationSpouseOldAttributes, QualificationSpouseOldCreationAttributes };
