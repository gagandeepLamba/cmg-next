import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface QualificationSpouseAttributes {
  id: number;
  leadid: number | null;
  qualifctn: string | null;
  specilization: string | null;
  university: string | null;
  assesment_body: string;
  type: string;
  rating: string | null;
}

interface QualificationSpouseCreationAttributes extends Optional<QualificationSpouseAttributes, 'leadid' | 'qualifctn' | 'specilization' | 'university' | 'rating'> {}

class QualificationSpouse extends Model<QualificationSpouseAttributes, QualificationSpouseCreationAttributes> implements QualificationSpouseAttributes {
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

QualificationSpouse.init(
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
    modelName: 'QualificationSpouse',
    tableName: 'qualification_spouse',
    timestamps: false,
    freezeTableName: true,
  });

export { QualificationSpouse };
export type { QualificationSpouseAttributes, QualificationSpouseCreationAttributes };
