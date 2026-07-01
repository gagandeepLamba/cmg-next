import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/sequelize';
import { DmEmployee } from './DmEmployee';
import { DmcOpportunities } from './DmcOpportunities';
interface DmcForumLeadsAttributes {
  id: number;
  fname: string;
  mname: string;
  lname: string;
  email: string;
  phone: string;
  mobile: string;
  nationality: string;
  address: string;
  dob: Date | null;
  gender: string;
  id_number: string;
  id_expiry: Date;
  id_issue_date: Date;
  country_interest: string;
  sub_country_interest: number;
  service_interest: string;
  market_source: string;
  sub_market_source: number;
  appointment: Date | null;
  followup: Date;
  folowuptime: Date;
  followupstat: number;
  enquiry: string;
  convet: string;
  priority: string;
  regdate: Date;
  regtime: Date;
  last_updated: string;
  last_updtd_time: string;
  stepComplete: number;
  payType: string | null;
  assignTo: number;
  case_officer: number;
  Counsilor: number;
  branch: number;
  region: number;
  payTotal: number;
  discount: number;
  paidYet: number | null;
  payBalance: number;
  feeAgreeDate: Date | null;
  demandAmt: number;
  dueDate: Date | null;
  demdRemark: string | null;
  agreeDate: Date | null;
  renDate: Date | null;
  renExpiryDate: Date | null;
  renew_type: string | null;
  status: string | null;
  status_date: Date;
  notf: number;
  type: string;
  password: string | null;
  novat: number | null;
  i_p: string | null;
  escalation: string | null;
  transfer_date: Date | null;
  transfer_time: string;
  transfered: number | null;
  transfered_by: number;
  otp_status: number | null;
  otp: number | null;
  otp_date: Date | null;
  otp_email: string | null;
  browser: string | null;
  hostname: string | null;
  digital_signature: string | null;
  lead_import_by: number | null;
  lead_import: number | null;
  education: string | null;
  profession: string | null;
  exist: number;
  no_of_applicants: number;
  advanced: number;
  do_status: number;
  arm_status: number;
  gm_status: number;
  discount_status: number;
  discount_remarks: string;
  discount_by: number;
  discount_date: Date;
  campaign: string;
  campaign_group: string;
  pa_fname: string;
  pa_lname: string;
  lead_remark: string;
  created: Date;
  created_by: number;
  alert: number;
  area: string;
  lead_quality: string;
  transferred_remark_update: number;
  untouch_transfer: number;
  lead_nq_reason: string;
  tele_caller_alert: number;
  tele_caller_remark: string;
  tele_caller_remark_by: number;
  tele_date: Date;
  lead_date: Date;
  duplicate: number;
  duplicate_count: number;
  ref_remark: string;
  na_record: number;
  old_assgined: number;
  nal_count: number;
  campaign_id: number;
  old_branch: number;
  // Opportunity conversion fields
  opportunity_status: string | null;
  conversion_date: Date | null;
  conversion_reason: string | null;
  lost_reason: string | null;
  competitor: string | null;
  qualification_score: number | null;
  budget_range: string | null;
  timeline: string | null;
  decision_maker: string | null;
  decision_maker_title: string | null;
  decision_maker_contact: string | null;
  next_followup_date: Date | null;
  opportunity_notes: string | null;
  tags: string | null;
}

interface DmcForumLeadsCreationAttributes extends Optional<DmcForumLeadsAttributes, 'id' | 'dob' | 'appointment' | 'followup' | 'folowuptime' | 'followupstat' | 'stepComplete' | 'payType' | 'payTotal' | 'discount' | 'paidYet' | 'payBalance' | 'feeAgreeDate' | 'demandAmt' | 'dueDate' | 'demdRemark' | 'agreeDate' | 'renDate' | 'renExpiryDate' | 'renew_type' | 'status' | 'notf' | 'password' | 'novat' | 'i_p' | 'escalation' | 'transfer_date' | 'transfered' | 'otp_status' | 'otp' | 'otp_date' | 'otp_email' | 'browser' | 'hostname' | 'digital_signature' | 'lead_import_by' | 'lead_import' | 'education' | 'profession'> { }

class DmcForumLeads extends Model<DmcForumLeadsAttributes, DmcForumLeadsCreationAttributes> implements DmcForumLeadsAttributes {
  public id!: number;
  public fname!: string;
  public mname!: string;
  public lname!: string;
  public email!: string;
  public phone!: string;
  public mobile!: string;
  public nationality!: string;
  public address!: string;
  public dob!: Date | null;
  public gender!: string;
  public id_number!: string;
  public id_expiry!: Date;
  public id_issue_date!: Date;
  public country_interest!: string;
  public sub_country_interest!: number;
  public service_interest!: string;
  public market_source!: string;
  public sub_market_source!: number;
  public appointment!: Date | null;
  public followup!: Date;
  public folowuptime!: Date;
  public followupstat!: number;
  public enquiry!: string;
  public convet!: string;
  public priority!: string;
  public regdate!: Date;
  public regtime!: Date;
  public last_updated!: string;
  public last_updtd_time!: string;
  public stepComplete!: number;
  public payType!: string | null;
  public assignTo!: number;
  public case_officer!: number;
  public Counsilor!: number;
  public branch!: number;
  public region!: number;
  public payTotal!: number;
  public discount!: number;
  public paidYet!: number | null;
  public payBalance!: number;
  public feeAgreeDate!: Date | null;
  public demandAmt!: number;
  public dueDate!: Date | null;
  public demdRemark!: string | null;
  public agreeDate!: Date | null;
  public renDate!: Date | null;
  public renExpiryDate!: Date | null;
  public renew_type!: string | null;
  public status!: string | null;
  public status_date!: Date;
  public notf!: number;
  public type!: string;
  public password!: string | null;
  public novat!: number | null;
  public i_p!: string | null;
  public escalation!: string | null;
  public transfer_date!: Date | null;
  public transfer_time!: string;
  public transfered!: number | null;
  public transfered_by!: number;
  public otp_status!: number | null;
  public otp!: number | null;
  public otp_date!: Date | null;
  public otp_email!: string | null;
  public browser!: string | null;
  public hostname!: string | null;
  public digital_signature!: string | null;
  public lead_import_by!: number | null;
  public lead_import!: number | null;
  public education!: string | null;
  public profession!: string | null;
  public exist!: number;
  public no_of_applicants!: number;
  public advanced!: number;
  public do_status!: number;
  public arm_status!: number;
  public gm_status!: number;
  public discount_status!: number;
  public discount_remarks!: string;
  public discount_by!: number;
  public discount_date!: Date;
  public campaign!: string;
  public campaign_group!: string;
  public pa_fname!: string;
  public pa_lname!: string;
  public lead_remark!: string;
  public created!: Date;
  public created_by!: number;
  public alert!: number;
  public area!: string;
  public lead_quality!: string;
  public transferred_remark_update!: number;
  public untouch_transfer!: number;
  public lead_nq_reason!: string;
  public tele_caller_alert!: number;
  public tele_caller_remark!: string;
  public tele_caller_remark_by!: number;
  public tele_date!: Date;
  public lead_date!: Date;
  public duplicate!: number;
  public duplicate_count!: number;
  public ref_remark!: string;
  public na_record!: number;
  public old_assgined!: number;
  public nal_count!: number;
  public campaign_id!: number;
  public old_branch!: number;
  // Opportunity conversion fields
  public opportunity_status!: string | null;
  public conversion_date!: Date | null;
  public conversion_reason!: string | null;
  public lost_reason!: string | null;
  public competitor!: string | null;
  public qualification_score!: number | null;
  public budget_range!: string | null;
  public timeline!: string | null;
  public decision_maker!: string | null;
  public decision_maker_title!: string | null;
  public decision_maker_contact!: string | null;
  public next_followup_date!: Date | null;
  public opportunity_notes!: string | null;
  public tags!: string | null;

  // Associations
  public dmEmployeeByASSIGNTo?: DmEmployee;
  public dmEmployeeByCASEOFFICER?: DmEmployee;
  public dmEmployeeByCoUNSILOR?: DmEmployee;
  public dmBranch?: any;
  public dmRegion?: any;
  public dmcNotifications?: any[];
  public dmcFollowUpReminders?: any[];
  public dmcMeetingSchedules?: any[];

  public static associate(models: any) {
    // Core working associations
    DmcForumLeads.belongsTo(models.DmEmployee, { foreignKey: 'assignTo', targetKey: 'id', as: 'dmEmployeeByASSIGNTo' });
    DmcForumLeads.belongsTo(models.DmBranch, { foreignKey: 'branch', targetKey: 'id', as: 'dmBranch' });
    
    // Opportunities association
    DmcForumLeads.hasMany(models.DmcOpportunities, { foreignKey: 'leadId', sourceKey: 'id', as: 'dmcOpportunities' });
    DmcForumLeads.hasMany(models.DmOperationStageData, { foreignKey: 'leadId', sourceKey: 'id', as: 'operationStages' });
    DmcForumLeads.hasMany(models.DmOpsDocuments, { foreignKey: 'leadId', sourceKey: 'id', as: 'operationsDocuments' });
    DmcForumLeads.belongsTo(models.DmRegion, { foreignKey: 'region', targetKey: 'id', as: 'dmRegion' });
    
    // Optional associations that may exist
    if (models.DmEmployee) {
      DmcForumLeads.belongsTo(models.DmEmployee, { foreignKey: 'case_officer', targetKey: 'id', as: 'dmEmployeeByCASEOFFICER' });
      DmcForumLeads.belongsTo(models.DmEmployee, { foreignKey: 'Counsilor', targetKey: 'id', as: 'dmEmployeeByCoUNSILOR' });
    }
    
    // Only add associations if the models exist and columns are present
    if (models.DmcNotifications) {
      DmcForumLeads.hasMany(models.DmcNotifications, { foreignKey: 'user_id', sourceKey: 'assignTo', as: 'dmcNotifications' });
    }
    
    if (models.DmcFollowUpReminders) {
      DmcForumLeads.hasMany(models.DmcFollowUpReminders, { foreignKey: 'lead_id', sourceKey: 'id', as: 'dmcFollowUpReminders' });
    }
    
    if (models.DmcMeetingSchedules) {
      DmcForumLeads.hasMany(models.DmcMeetingSchedules, { foreignKey: 'lead_id', sourceKey: 'id', as: 'dmcMeetingSchedules' });
    }
    
    // Only add opportunity association if the column exists
    if (models.DmcOpportunities) {
      // Check if opportunity_id column exists before adding association
      // This will be handled at runtime to avoid errors
    }
  }
}

DmcForumLeads.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fname: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    mname: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    lname: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    mobile: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    nationality: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    id_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_expiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_issue_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    country_interest: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    sub_country_interest: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_interest: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    market_source: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    sub_market_source: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    appointment: {
      type: DataTypes.DATE,
      allowNull: true
    },
    followup: {
      type: DataTypes.DATE,
      allowNull: false
    },
    folowuptime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    followupstat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    enquiry: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    convet: {
      type: DataTypes.STRING(555),
      allowNull: false
    },
    priority: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    regdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    regtime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    last_updated: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    last_updtd_time: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    stepComplete: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    payType: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    assignTo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    case_officer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Counsilor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    paidYet: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    payBalance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    feeAgreeDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    demandAmt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    demdRemark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    agreeDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    renDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    renExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    renew_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notf: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    novat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    i_p: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    escalation: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    transfer_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transfer_time: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    transfered: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transfered_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otp_status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    otp_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    otp_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    browser: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hostname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    digital_signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lead_import_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lead_import: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    education: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profession: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    exist: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    no_of_applicants: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    advanced: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    do_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    arm_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gm_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    discount_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    campaign: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    campaign_group: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pa_fname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pa_lname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lead_remark: {
      type: DataTypes.TEXT,
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
    alert: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lead_quality: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    transferred_remark_update: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    untouch_transfer: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lead_nq_reason: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tele_caller_alert: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tele_caller_remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tele_caller_remark_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tele_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lead_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duplicate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duplicate_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ref_remark: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    na_record: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_assgined: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nal_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_branch: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Opportunity conversion fields
    opportunity_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    conversion_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    conversion_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lost_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    competitor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    qualification_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    budget_range: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    timeline: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    decision_maker: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    decision_maker_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    decision_maker_contact: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    next_followup_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    opportunity_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'DmcForumLeads',
    tableName: 'dmc_forum_leads',
    timestamps: false,
    freezeTableName: true,
  });

export { DmcForumLeads };
export type { DmcForumLeadsAttributes, DmcForumLeadsCreationAttributes };
