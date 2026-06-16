import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
interface OldData1Attributes {
  id: number;
  Agno: string | null;
  SignupDate: string | null;
  ClientName: string | null;
  Mobile: string | null;
  Email: string | null;
  Country: string | null;
  Branch: string | null;
  TotalPackage: string | null;
  PaidAmount: string | null;
  PendingAmount: string | null;
  Counselor: string | null;
  CPO1: string | null;
  CPO2: string | null;
  EcaStatus: string | null;
  SpouseEca: string | null;
  IETSstatus: string | null;
  EEstatus: string | null;
  Noc: string | null;
  CRS: string | null;
  StatusLastUpdated: string | null;
  PnpSubmitted: string | null;
  Decision: string | null;
  Remarks: string | null;
  flag: string | null;
}

interface OldData1CreationAttributes extends Optional<OldData1Attributes, 'Agno' | 'SignupDate' | 'ClientName' | 'Mobile' | 'Email' | 'Country' | 'Branch' | 'TotalPackage' | 'PaidAmount' | 'PendingAmount' | 'Counselor' | 'CPO1' | 'CPO2' | 'EcaStatus' | 'SpouseEca' | 'IETSstatus' | 'EEstatus' | 'Noc' | 'CRS' | 'StatusLastUpdated' | 'PnpSubmitted' | 'Decision' | 'Remarks' | 'flag'> {}

class OldData1 extends Model<OldData1Attributes, OldData1CreationAttributes> implements OldData1Attributes {
  public id!: number;
  public Agno!: string | null;
  public SignupDate!: string | null;
  public ClientName!: string | null;
  public Mobile!: string | null;
  public Email!: string | null;
  public Country!: string | null;
  public Branch!: string | null;
  public TotalPackage!: string | null;
  public PaidAmount!: string | null;
  public PendingAmount!: string | null;
  public Counselor!: string | null;
  public CPO1!: string | null;
  public CPO2!: string | null;
  public EcaStatus!: string | null;
  public SpouseEca!: string | null;
  public IETSstatus!: string | null;
  public EEstatus!: string | null;
  public Noc!: string | null;
  public CRS!: string | null;
  public StatusLastUpdated!: string | null;
  public PnpSubmitted!: string | null;
  public Decision!: string | null;
  public Remarks!: string | null;
  public flag!: string | null;

  public static associate(models: any) {
  }
}

OldData1.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Agno: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    SignupDate: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    ClientName: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Mobile: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Country: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Branch: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    TotalPackage: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PaidAmount: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PendingAmount: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Counselor: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    CPO1: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    CPO2: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    EcaStatus: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    SpouseEca: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    IETSstatus: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    EEstatus: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Noc: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    CRS: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    StatusLastUpdated: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    PnpSubmitted: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Decision: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    flag: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'OldData1',
    tableName: 'old_data_1',
    timestamps: false,
    freezeTableName: true,
  });

export { OldData1 };
export type { OldData1Attributes, OldData1CreationAttributes };
