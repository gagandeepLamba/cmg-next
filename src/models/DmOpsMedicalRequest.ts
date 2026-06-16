import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmOpsMedicalRequestAttributes {
  id: number;
  leadId: number;
  MedicalRequestDate: Date;
  CompletionDate: Date;
  SubmissionDate: Date;
  comments: string;
}

interface DmOpsMedicalRequestCreationAttributes extends Optional<DmOpsMedicalRequestAttributes, never> {}

class DmOpsMedicalRequest extends Model<DmOpsMedicalRequestAttributes, DmOpsMedicalRequestCreationAttributes> implements DmOpsMedicalRequestAttributes {
  public id!: number;
  public leadId!: number;
  public MedicalRequestDate!: Date;
  public CompletionDate!: Date;
  public SubmissionDate!: Date;
  public comments!: string;

  public static associate(models: any) {
  }
}

DmOpsMedicalRequest.init(
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
    MedicalRequestDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CompletionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    SubmissionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'DmOpsMedicalRequest',
    tableName: 'dm_ops_medical_request',
    timestamps: false,
    freezeTableName: true,
  });

export { DmOpsMedicalRequest };
export type { DmOpsMedicalRequestAttributes, DmOpsMedicalRequestCreationAttributes };
