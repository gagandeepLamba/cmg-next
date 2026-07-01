import { Model, DataTypes, Optional, type ModelStatic } from 'sequelize';
import { sequelize } from '../lib/sequelize';
import { DmcForumLeads } from './DmcForumLeads';
interface DmEmployeeAttributes {
  id: number;
  name: string;
  email: string | null;
  cemail: string | null;
  mobile: string | null;
  cmobile: string | null;
  paddress: string | null;
  address: string | null;
  photo: string | null;
  dob: Date | null;
  role: number | null;
  vendor_id: number;
  branch: number | null;
  region: number | null;
  username: string | null;
  password: string | null;
  status: number;
  ppNo: string | null;
  visaExp: Date | null;
  department: number | null;
  EID: string | null;
  doj: Date | null;
  nationality: string | null;
  dol: string | null;
  remark: string | null;
  labexp: string | null;
  bounce: number | null;
  em_local_name: string | null;
  em_home_name: string | null;
  em_local_number: string | null;
  em_home_number: string | null;
  religion: string;
  gender: string;
  crea: number;
  wfh: number;
  work_location: string;
  work_country: string | null;
  work_city: string | null;
  work_site: string | null;
  employment_type: string;
}

type DmEmployeeCreationAttributes = Optional<DmEmployeeAttributes, 'email' | 'cemail' | 'mobile' | 'cmobile' | 'paddress' | 'address' | 'photo' | 'dob' | 'role' | 'branch' | 'region' | 'username' | 'password' | 'status' | 'ppNo' | 'visaExp' | 'department' | 'EID' | 'doj' | 'nationality' | 'dol' | 'remark' | 'labexp' | 'bounce' | 'em_local_name' | 'em_home_name' | 'em_local_number' | 'em_home_number' | 'work_location' | 'work_country' | 'work_city' | 'work_site' | 'employment_type'>;

type AssociationModels = {
  DmRole: ModelStatic<Model>;
  DmcForumLeads: ModelStatic<Model>;
  StudentLeadsLogs: ModelStatic<Model>;
  DmOperationAllocations: ModelStatic<Model>;
};

class DmEmployee extends Model<DmEmployeeAttributes, DmEmployeeCreationAttributes> implements DmEmployeeAttributes {
  public id!: number;
  public name!: string;
  public email!: string | null;
  public cemail!: string | null;
  public mobile!: string | null;
  public cmobile!: string | null;
  public paddress!: string | null;
  public address!: string | null;
  public photo!: string | null;
  public dob!: Date | null;
  public role!: number | null;
  public vendor_id!: number;
  public branch!: number | null;
  public region!: number | null;
  public username!: string | null;
  public password!: string | null;
  public status!: number;
  public ppNo!: string | null;
  public visaExp!: Date | null;
  public department!: number | null;
  public EID!: string | null;
  public doj!: Date | null;
  public nationality!: string | null;
  public dol!: string | null;
  public remark!: string | null;
  public labexp!: string | null;
  public bounce!: number | null;
  public em_local_name!: string | null;
  public em_home_name!: string | null;
  public em_local_number!: string | null;
  public em_home_number!: string | null;
  public religion!: string;
  public gender!: string;
  public crea!: number;
  public wfh!: number;
  public work_location!: string;
  public work_country!: string | null;
  public work_city!: string | null;
  public work_site!: string | null;
  public employment_type!: string;

  // Association properties
  public dmcForumLeadssByASSIGNTo?: DmcForumLeads[];
  public dmcForumLeadssByCASEOFFICER?: DmcForumLeads[];
  public dmcForumLeadssByCoUNSILOR?: DmcForumLeads[];
  public studentLeadsLogss?: unknown[];

  public static associate(models: AssociationModels) {
    DmEmployee.belongsTo(models.DmRole, { foreignKey: 'role', targetKey: 'id', as: 'dmRole' });
    DmEmployee.hasMany(models.DmcForumLeads, { foreignKey: 'assignTo', sourceKey: 'id', as: 'dmcForumLeadssByASSIGNTo' });
    DmEmployee.hasMany(models.DmcForumLeads, { foreignKey: 'case_officer', sourceKey: 'id', as: 'dmcForumLeadssByCASEOFFICER' });
    DmEmployee.hasMany(models.DmcForumLeads, { foreignKey: 'Counsilor', sourceKey: 'id', as: 'dmcForumLeadssByCoUNSILOR' });
    DmEmployee.hasMany(models.StudentLeadsLogs, { foreignKey: 'Counsilor', sourceKey: 'id', as: 'studentLeadsLogss' });
    DmEmployee.hasMany(models.DmOperationAllocations, { foreignKey: 'case_officer', sourceKey: 'id', as: 'operationAllocations' });
  }
}

DmEmployee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cemail: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cmobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    paddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    ppNo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    visaExp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    department: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    EID: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    doj: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING(555),
      allowNull: true
    },
    dol: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    labexp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bounce: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    em_local_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    em_home_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    em_local_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    em_home_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    religion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    crea: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wfh: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    work_location: {
      type: DataTypes.ENUM('Onshore', 'Offshore', 'Remote-UAE', 'GCC-Branch'),
      allowNull: false,
      defaultValue: 'Onshore'
    },
    work_country: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'UAE'
    },
    work_city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    work_site: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    employment_type: {
      type: DataTypes.ENUM('Full-time', 'Contract', 'Freelance', 'Part-time'),
      allowNull: false,
      defaultValue: 'Full-time'
    },
  },
  {
    sequelize,
    modelName: 'DmEmployee',
    tableName: 'dm_employee',
    timestamps: false,
    freezeTableName: true,
  });

export { DmEmployee };
export type { DmEmployeeAttributes, DmEmployeeCreationAttributes };
