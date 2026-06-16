import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmAuditorReviewsAttributes {
  id: number;
  leadId: number;
  status: string;
  remarks: string;
  created_by: number;
  created: Date;
}

interface DmAuditorReviewsCreationAttributes extends Optional<DmAuditorReviewsAttributes, never> {}

class DmAuditorReviews extends Model<DmAuditorReviewsAttributes, DmAuditorReviewsCreationAttributes> implements DmAuditorReviewsAttributes {
  public id!: number;
  public leadId!: number;
  public status!: string;
  public remarks!: string;
  public created_by!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmAuditorReviews.init(
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
    status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
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
    modelName: 'DmAuditorReviews',
    tableName: 'dm_auditor_reviews',
    timestamps: false,
    freezeTableName: true,
  });

export { DmAuditorReviews };
export type { DmAuditorReviewsAttributes, DmAuditorReviewsCreationAttributes };
