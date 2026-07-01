import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface DmTaskAttributes {
  id: number;
  task: string | null;
  dob: Date | null;
  date_created: string | null;
  stage: number;
  asignTo: number;
  asignBy: number;
  status: string;
  doc: string | null;
  notf: number;
  created: Date;
}

interface DmTaskCreationAttributes extends Optional<DmTaskAttributes, 'task' | 'dob' | 'date_created' | 'stage' | 'asignTo' | 'asignBy' | 'status' | 'doc' | 'notf' | 'created'> {}

class DmTask extends Model<DmTaskAttributes, DmTaskCreationAttributes> implements DmTaskAttributes {
  public id!: number;
  public task!: string | null;
  public dob!: Date | null;
  public date_created!: string | null;
  public stage!: number;
  public asignTo!: number;
  public asignBy!: number;
  public status!: string;
  public doc!: string | null;
  public notf!: number;
  public created!: Date;

  public static associate(models: any) {
  }
}

DmTask.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    task: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_created: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    stage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    asignTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    asignBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '0'
    },
    doc: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    notf: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '\'0000-00-00'
    },
  },
  {
    sequelize,
    modelName: 'DmTask',
    tableName: 'dm_task',
    timestamps: false,
    freezeTableName: true,
  });

export { DmTask };
export type { DmTaskAttributes, DmTaskCreationAttributes };
