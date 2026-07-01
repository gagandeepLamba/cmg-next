import { sequelize } from '../lib/sequelize';

import { Appointments } from './Appointments';
import { AppointmentCounteries } from './AppointmentCounteries';
import { AuditorFollowups } from './AuditorFollowups';
import { AuditorMeetings } from './AuditorMeetings';
import { AusEoi } from './AusEoi';
import { AusEoiOld } from './AusEoiOld';
import { AusNom } from './AusNom';
import { AusNomOld } from './AusNomOld';
import { BranchTarget } from './BranchTarget';
import { BusinessAssPayment } from './BusinessAssPayment';
import { CanadaStatus } from './CanadaStatus';
import { ClientStatus } from './ClientStatus';
import { ClientStatusOld } from './ClientStatusOld';
import { DmcAuhEmailLeads } from './DmcAuhEmailLeads';
import { DmcAutoReassignmentRules } from './DmcAutoReassignmentRules';
import { DmcAutoReassignmentRuns } from './DmcAutoReassignmentRuns';
import { DmcForumEmailLeads } from './DmcForumEmailLeads';
import { DmcForumLeads } from './DmcForumLeads';
import { DmcForumLeadsAssesments } from './DmcForumLeadsAssesments';
import { DmcForumLeadsAssesmentDesgn } from './DmcForumLeadsAssesmentDesgn';
import { DmcForumLeadsAssesmentEdu } from './DmcForumLeadsAssesmentEdu';
import { DmcForumLeadsContracts } from './DmcForumLeadsContracts';
import { DmcForumLeadsFee } from './DmcForumLeadsFee';
import { DmcForumLeadsObservations } from './DmcForumLeadsObservations';
import { DmcForumLeadsObservationOld } from './DmcForumLeadsObservationOld';
import { DmcForumLeadsRemarks } from './DmcForumLeadsRemarks';
import { DmcForumLeadsRemarkG } from './DmcForumLeadsRemarkG';
import { DmcForumLeadsRemarkOlds } from './DmcForumLeadsRemarkOlds';
import { DmcNewAddLeads } from './DmcNewAddLeads';
import { DmcNewAddPoLeads } from './DmcNewAddPoLeads';
import { Dm3partyPayment } from './Dm3partyPayment';
import { Dm3partyPaymentDet } from './Dm3partyPaymentDet';
import { Dm3partyPaymentOld } from './Dm3partyPaymentOld';
import { DmAccounts } from './DmAccounts';
import { DmAdditionalDocuments } from './DmAdditionalDocuments';
import { DmAdmin } from './DmAdmin';
import { DmAppointments } from './DmAppointments';
import { DmAppointmentRemarks } from './DmAppointmentRemarks';
import { DmAuditorCounts } from './DmAuditorCounts';
import { DmAuditorReviews } from './DmAuditorReviews';
import { DmB2b } from './DmB2b';
import { DmB2bInvoices } from './DmB2bInvoices';
import { DmBatch } from './DmBatch';
import { DmBranch } from './DmBranch';
import { DmBranchAllocations } from './DmBranchAllocations';
import { DmBusinessFee } from './DmBusinessFee';
import { DmBusinessPaymentPlan } from './DmBusinessPaymentPlan';
import { DmBusinessPortugalPaymentPlan } from './DmBusinessPortugalPaymentPlan';
import { DmCampaigns } from './DmCampaigns';
import { DmCf7db2916 } from './DmCf7db2916';
import { DmCf7db3232 } from './DmCf7db3232';
import { DmCf7db3606 } from './DmCf7db3606';
import { DmCf7db3848 } from './DmCf7db3848';
import { DmCf7db3870 } from './DmCf7db3870';
import { DmCf7db4077 } from './DmCf7db4077';
import { DmCf7db4088 } from './DmCf7db4088';
import { DmClients } from './DmClients';
import { DmClientConversations } from './DmClientConversations';
import { DmClientEdu } from './DmClientEdu';
import { DmClientLogs } from './DmClientLogs';
import { DmClientPersonal } from './DmClientPersonal';
import { DmClientPersonalOld } from './DmClientPersonalOld';
import { DmCommercialInvoices } from './DmCommercialInvoices';
import { DmContractFile } from './DmContractFile';
import { DmCounsilorAllocations } from './DmCounsilorAllocations';
import { DmCountries } from './DmCountries';
import { DmCountriesTypeProgram } from './DmCountriesTypeProgram';
import { DmCountryProces } from './DmCountryProces';
import { DmCurrency } from './DmCurrency';
import { DmDepartment } from './DmDepartment';
import { DmDupLiveChatLeads } from './DmDupLiveChatLeads';
import { DmDupLpLeads } from './DmDupLpLeads';
import { DmEipAipp } from './DmEipAipp';
import { DmEipMcdii } from './DmEipMcdii';
import { DmEipRnip } from './DmEipRnip';
import { DmEmailAttachments } from './DmEmailAttachments';
import { DmEmailTemplates } from './DmEmailTemplates';
import { DmEmployee } from './DmEmployee';
import { DmEmployeeAttendance } from './DmEmployeeAttendance';
import { DmEmployeeLogs } from './DmEmployeeLogs';
import { DmEmployeeLogsOld } from './DmEmployeeLogsOld';
import { DmEmployer } from './DmEmployer';
import { DmEmpSims } from './DmEmpSims';
import { DmEmpStocks } from './DmEmpStocks';
import { DmEnquiry } from './DmEnquiry';
import { DmEuropeCases } from './DmEuropeCases';
import { DmEuropeCasesVerification } from './DmEuropeCasesVerification';
import { DmEuropePaymentAdjustments } from './DmEuropePaymentAdjustments';
import { DmEuropePaymentOperations } from './DmEuropePaymentOperations';
import { DmEuropeVendorsPayments } from './DmEuropeVendorsPayments';
import { DmEvaluations } from './DmEvaluations';
import { DmEvaluationsSkills } from './DmEvaluationsSkills';
import { DmExpense } from './DmExpense';
import { DmExpenseCash } from './DmExpenseCash';
import { DmExpenseCashRecord } from './DmExpenseCashRecord';
import { DmFee } from './DmFee';
import { DmFinanceInvoice } from './DmFinanceInvoice';
import { DmForm4687 } from './DmForm4687';
import { DmForm4688 } from './DmForm4688';
import { DmForm4689 } from './DmForm4689';
import { DmForm4690 } from './DmForm4690';
import { DmForm4691 } from './DmForm4691';
import { DmForm4695 } from './DmForm4695';
import { DmGaryContract } from './DmGaryContract';
import { DmGroups } from './DmGroups';
import { DmHourlyLeadCounts } from './DmHourlyLeadCounts';
import { DmJobSearchQualification } from './DmJobSearchQualification';
import { DmJsOpsCompanyInterview } from './DmJsOpsCompanyInterview';
import { DmJsOpsLangProf } from './DmJsOpsLangProf';
import { DmJsOpsMonthlyStatus } from './DmJsOpsMonthlyStatus';
import { DmJsOpsNomination } from './DmJsOpsNomination';
import { DmJsOpsPrescreening } from './DmJsOpsPrescreening';
import { DmJsResumeWriting } from './DmJsResumeWriting';
import { DmLeadsEmailers } from './DmLeadsEmailers';
import { DmLeadCounts } from './DmLeadCounts';
import { DmLeadLiveChatCounts } from './DmLeadLiveChatCounts';
import { DmLeadLpCounts } from './DmLeadLpCounts';
import { DmLeadRoundRobinState } from './DmLeadRoundRobinState';
import { DmLeadShjCounts } from './DmLeadShjCounts';
import { DmLeaveHistory } from './DmLeaveHistory';
import { DmLeaveType } from './DmLeaveType';
import { DmLibrary } from './DmLibrary';
import { DmLibraryFolders } from './DmLibraryFolders';
import { DmLiveChatLeads } from './DmLiveChatLeads';
import { DmLmiaBrief } from './DmLmiaBrief';
import { DmLmiaPaymentAdjustments } from './DmLmiaPaymentAdjustments';
import { DmLogs } from './DmLogs';
import { DmNewClient } from './DmNewClient';
import { DmObservationFile } from './DmObservationFile';
import { DmOfficialEmails } from './DmOfficialEmails';
import { DmOldData } from './DmOldData';
import { DmOldPayment } from './DmOldPayment';
import { DmOperationAllocations } from './DmOperationAllocations';
import { DmOperationStageData } from './DmOperationStageData';
import { DmOpportunityComplianceApprovals } from './DmOpportunityComplianceApprovals';
import { DmOpsBusinessDocuments } from './DmOpsBusinessDocuments';
import { DmOpsBusinessDos } from './DmOpsBusinessDos';
import { DmOpsBusinesCanada } from './DmOpsBusinesCanada';
import { DmOpsBusinesPoland } from './DmOpsBusinesPoland';
import { DmOpsBusinesUk } from './DmOpsBusinesUk';
import { DmOpsBusinesUsa } from './DmOpsBusinesUsa';
import { DmOpsConversation } from './DmOpsConversation';
import { DmOpsConversationOld } from './DmOpsConversationOld';
import { DmOpsDocuments } from './DmOpsDocuments';
import { DmOpsDocumentsOld } from './DmOpsDocumentsOld';
import { DmOpsLangProf } from './DmOpsLangProf';
import { DmOpsLangProfOld } from './DmOpsLangProfOld';
import { DmOpsLangProfSpouse } from './DmOpsLangProfSpouse';
import { DmOpsLangProfSpouseOld } from './DmOpsLangProfSpouseOld';
import { DmOpsLmia } from './DmOpsLmia';
import { DmOpsMedicalRequest } from './DmOpsMedicalRequest';
import { DmOpsPolandApplication } from './DmOpsPolandApplication';
import { DmOpsPolandJol } from './DmOpsPolandJol';
import { DmOpsPolandLoc } from './DmOpsPolandLoc';
import { DmOpsSkillAustralia } from './DmOpsSkillAustralia';
import { DmOpsSkillAustraliaAssess } from './DmOpsSkillAustraliaAssess';
import { DmOpsSkillAustraliaAssessOld } from './DmOpsSkillAustraliaAssessOld';
import { DmOpsSkillAustraliaAssessSpouse } from './DmOpsSkillAustraliaAssessSpouse';
import { DmOpsSkillAustraliaAssessSpouseOld } from './DmOpsSkillAustraliaAssessSpouseOld';
import { DmOpsSkillAustraliaOld } from './DmOpsSkillAustraliaOld';
import { DmOpsSkillCanadaEca } from './DmOpsSkillCanadaEca';
import { DmOpsSkillCanadaEe } from './DmOpsSkillCanadaEe';
import { DmOpsSkillCanadaIta } from './DmOpsSkillCanadaIta';
import { DmOpsSkillCanadaOld } from './DmOpsSkillCanadaOld';
import { DmOpsStudentVisa } from './DmOpsStudentVisa';
import { DmOpsUpdatedBy } from './DmOpsUpdatedBy';
import { DmOpsVisitVisa } from './DmOpsVisitVisa';
import { DmOpsVisitVisaApplication } from './DmOpsVisitVisaApplication';
import { DmOpTeamAllocations } from './DmOpTeamAllocations';
import { DmcOpportunities } from './DmcOpportunities';
import { DmcOpportunityQuotations } from './DmcOpportunityQuotations';
import { DmcQuotationItems } from './DmcQuotationItems';
import { DmcOpportunityPayments } from './DmcOpportunityPayments';
import { DmcOpportunityDocuments } from './DmcOpportunityDocuments';
import { DmcOpportunityAgreements } from './DmcOpportunityAgreements';
import { DmcOpportunityActivities } from './DmcOpportunityActivities';
import { DmcDiscountApprovals } from './DmcDiscountApprovals';
import { DmcLeadReassignments } from './DmcLeadReassignments';
import { DmcNotifications } from './DmcNotifications';
import { DmcFollowUpReminders } from './DmcFollowUpReminders';
import { DmcMeetingSchedules } from './DmcMeetingSchedules';
import { DmPayHistory } from './DmPayHistory';
import { DmPayHistoryCrossBranch } from './DmPayHistoryCrossBranch';
import { DmPnp } from './DmPnp';
import { DmPnpOld } from './DmPnpOld';
import { DmPolandWorkPermit } from './DmPolandWorkPermit';
import { DmPolBiometrics } from './DmPolBiometrics';
import { DmPermission } from './DmPermission';
import { DmProgramType } from './DmProgramType';
import { DmProspectDocuments } from './DmProspectDocuments';
import { DmProspectRemarks } from './DmProspectRemarks';
import { DmProspects } from './DmProspects';
import { DmRefunds } from './DmRefunds';
import { DmRegion } from './DmRegion';
import { DmRole } from './DmRole';
import { DmRolePermission } from './DmRolePermission';
import { DmService } from './DmService';
import { DmSource } from './DmSource';
import { DmStages } from './DmStages';
import { DmSuccessStories } from './DmSuccessStories';
import { DmSuccessStoriesFolder } from './DmSuccessStoriesFolder';
import { DmSvAdmissions } from './DmSvAdmissions';
import { DmSvCic } from './DmSvCic';
import { DmSvCredentials } from './DmSvCredentials';
import { DmTargetDates } from './DmTargetDates';
import { DmTask } from './DmTask';
import { DmTeams } from './DmTeams';
import { DmThirdPartyPayments } from './DmThirdPartyPayments';
import { DmTrainingUpdates } from './DmTrainingUpdates';
import { DmUserBranches } from './DmUserBranches';
import { DmUserTeams } from './DmUserTeams';
import { DmVendors } from './DmVendors';
import { DmVendorDocuments } from './DmVendorDocuments';
import { DmVendorInvoice } from './DmVendorInvoice';
import { DmVvApplicantFees } from './DmVvApplicantFees';
import { DmVvBiometrics } from './DmVvBiometrics';
import { DmVvCredentials } from './DmVvCredentials';
import { DmWelcomeEmail } from './DmWelcomeEmail';
import { DmWelcomeEmailDocs } from './DmWelcomeEmailDocs';
import { DmWpCases } from './DmWpCases';
import { DmWpFee } from './DmWpFee';
import { Ecacredentials } from './Ecacredentials';
import { EcacredentialsOld } from './EcacredentialsOld';
import { EcacredentialsSpouse } from './EcacredentialsSpouse';
import { EcacredentialsSpouseOld } from './EcacredentialsSpouseOld';
import { Eecredentials } from './Eecredentials';
import { EecredentialsOld } from './EecredentialsOld';
import { Eeprofile } from './Eeprofile';
import { EeprofileOld } from './EeprofileOld';
import { EscalationLogs } from './EscalationLogs';
import { ExpenseType } from './ExpenseType';
import { GaryProspectss } from './GaryProspectss';
import { GaryWorkDocs } from './GaryWorkDocs';
import { Ielts } from './Ielts';
import { IeltsReport } from './IeltsReport';
import { Itaremarks } from './Itaremarks';
import { LeadLogs } from './LeadLogs';
import { LeadShuffleLogs } from './LeadShuffleLogs';
import { LpLeads } from './LpLeads';
import { MasterSheets } from './MasterSheets';
import { MasterSheetsECA } from './MasterSheetsECA';
import { MasterSheetsEIP } from './MasterSheetsEIP';
import { MasterSheetsEoiAustralia } from './MasterSheetsEoiAustralia';
import { MasterSheetsEU } from './MasterSheetsEU';
import { MasterSheetsITA } from './MasterSheetsITA';
import { MasterSheetsPNP } from './MasterSheetsPNP';
import { MasterSheetsSA } from './MasterSheetsSA';
import { MasterSheetsSkillAssessment } from './MasterSheetsSkillAssessment';
import { MasterSheetsVV } from './MasterSheetsVV';
import { MasterSheetsXPS } from './MasterSheetsXPS';
import { OldData1 } from './OldData1';
import { OldData2 } from './OldData2';
import { OldDataAuh } from './OldDataAuh';
import { OldDataPun } from './OldDataPun';
import { OldDataShj } from './OldDataShj';
import { OpsBusinessRemarks } from './OpsBusinessRemarks';
import { OpsLogs } from './OpsLogs';
import { OpsRemarks } from './OpsRemarks';
import { OpsRemarksOld } from './OpsRemarksOld';
import { Qualification } from './Qualification';
import { QualificationOld } from './QualificationOld';
import { QualificationSpouse } from './QualificationSpouse';
import { QualificationSpouseOld } from './QualificationSpouseOld';
import { StudentLeadsLogs } from './StudentLeadsLogs';
import { Target } from './Target';
import { TaskRemarks } from './TaskRemarks';
import { WpCf7db2916 } from './WpCf7db2916';
import { WpCf7db3232 } from './WpCf7db3232';
import { WpCf7db3284 } from './WpCf7db3284';
import { WpCf7db3606 } from './WpCf7db3606';
import { WpCf7db3848 } from './WpCf7db3848';
import { WpCf7db3870 } from './WpCf7db3870';
import { WpCf7db3881 } from './WpCf7db3881';
import { WpCf7db4077 } from './WpCf7db4077';
import { WpCf7db4086 } from './WpCf7db4086';
import { WpCf7db5499 } from './WpCf7db5499';
import { WpCf7db5500 } from './WpCf7db5500';
import {
  HrAttendanceRecord,
  HrEmployeeDocument,
  HrEmployeeLetter,
  HrEosbSettlement,
  HrExitChecklist,
  HrExitChecklistItem,
  HrExitInterview,
  HrHeadcountSnapshot,
  HrLeaveBalance,
  HrLeaveRequest,
  HrLetterTemplate,
  HrPayslip,
  NotificationLog,
  ProCompany,
  ProDocument,
  ProEmployeeImmigration,
  ProGccBranchDocument,
  ProInsuranceRecord,
  ProMonthlyTask,
  ProOwnerDocument,
  ProWpsRecord,
} from './HrProModels';
import { DmOpportunityWorkflowReview } from './DmOpportunityWorkflowReview';
import { DmOpportunityWorkflowAuditLog } from './DmOpportunityWorkflowAuditLog';
import { DmOpportunityHandoverNote } from './DmOpportunityHandoverNote';
import { DmOpportunityAccountingVerification } from './DmOpportunityAccountingVerification';
import { DmClientUploadPortal } from './DmClientUploadPortal';
import { DmClientUploadChecklistItem } from './DmClientUploadChecklistItem';
import { DmOpportunityPaymentSchedule } from './DmOpportunityPaymentSchedule';

const models = {
  Appointments: Appointments,
  AppointmentCounteries: AppointmentCounteries,
  AuditorFollowups: AuditorFollowups,
  AuditorMeetings: AuditorMeetings,
  AusEoi: AusEoi,
  AusEoiOld: AusEoiOld,
  AusNom: AusNom,
  AusNomOld: AusNomOld,
  BranchTarget: BranchTarget,
  BusinessAssPayment: BusinessAssPayment,
  CanadaStatus: CanadaStatus,
  ClientStatus: ClientStatus,
  ClientStatusOld: ClientStatusOld,
  DmcAuhEmailLeads: DmcAuhEmailLeads,
  DmcAutoReassignmentRules: DmcAutoReassignmentRules,
  DmcAutoReassignmentRuns: DmcAutoReassignmentRuns,
  DmcForumEmailLeads: DmcForumEmailLeads,
  DmcForumLeads: DmcForumLeads,
  DmcForumLeadsAssesments: DmcForumLeadsAssesments,
  DmcForumLeadsAssesmentDesgn: DmcForumLeadsAssesmentDesgn,
  DmcForumLeadsAssesmentEdu: DmcForumLeadsAssesmentEdu,
  DmcForumLeadsContracts: DmcForumLeadsContracts,
  DmcForumLeadsFee: DmcForumLeadsFee,
  DmcForumLeadsObservations: DmcForumLeadsObservations,
  DmcForumLeadsObservationOld: DmcForumLeadsObservationOld,
  DmcForumLeadsRemarks: DmcForumLeadsRemarks,
  DmcForumLeadsRemarkG: DmcForumLeadsRemarkG,
  DmcForumLeadsRemarkOlds: DmcForumLeadsRemarkOlds,
  DmcNewAddLeads: DmcNewAddLeads,
  DmcNewAddPoLeads: DmcNewAddPoLeads,
  Dm3partyPayment: Dm3partyPayment,
  Dm3partyPaymentDet: Dm3partyPaymentDet,
  Dm3partyPaymentOld: Dm3partyPaymentOld,
  DmAccounts: DmAccounts,
  DmAdditionalDocuments: DmAdditionalDocuments,
  DmAdmin: DmAdmin,
  DmAppointments: DmAppointments,
  DmAppointmentRemarks: DmAppointmentRemarks,
  DmAuditorCounts: DmAuditorCounts,
  DmAuditorReviews: DmAuditorReviews,
  DmB2b: DmB2b,
  DmB2bInvoices: DmB2bInvoices,
  DmBatch: DmBatch,
  DmBranch: DmBranch,
  DmBranchAllocations: DmBranchAllocations,
  DmBusinessFee: DmBusinessFee,
  DmBusinessPaymentPlan: DmBusinessPaymentPlan,
  DmBusinessPortugalPaymentPlan: DmBusinessPortugalPaymentPlan,
  DmCampaigns: DmCampaigns,
  DmCf7db2916: DmCf7db2916,
  DmCf7db3232: DmCf7db3232,
  DmCf7db3606: DmCf7db3606,
  DmCf7db3848: DmCf7db3848,
  DmCf7db3870: DmCf7db3870,
  DmCf7db4077: DmCf7db4077,
  DmCf7db4088: DmCf7db4088,
  DmClients: DmClients,
  DmClientConversations: DmClientConversations,
  DmClientEdu: DmClientEdu,
  DmClientLogs: DmClientLogs,
  DmClientPersonal: DmClientPersonal,
  DmClientPersonalOld: DmClientPersonalOld,
  DmCommercialInvoices: DmCommercialInvoices,
  DmContractFile: DmContractFile,
  DmCounsilorAllocations: DmCounsilorAllocations,
  DmCountries: DmCountries,
  DmCountriesTypeProgram: DmCountriesTypeProgram,
  DmCountryProces: DmCountryProces,
  DmCurrency: DmCurrency,
  DmDepartment: DmDepartment,
  DmDupLiveChatLeads: DmDupLiveChatLeads,
  DmDupLpLeads: DmDupLpLeads,
  DmEipAipp: DmEipAipp,
  DmEipMcdii: DmEipMcdii,
  DmEipRnip: DmEipRnip,
  DmEmailAttachments: DmEmailAttachments,
  DmEmailTemplates: DmEmailTemplates,
  DmEmployee: DmEmployee,
  DmEmployeeAttendance: DmEmployeeAttendance,
  DmEmployeeLogs: DmEmployeeLogs,
  DmEmployeeLogsOld: DmEmployeeLogsOld,
  DmEmployer: DmEmployer,
  DmEmpSims: DmEmpSims,
  DmEmpStocks: DmEmpStocks,
  DmEnquiry: DmEnquiry,
  DmEuropeCases: DmEuropeCases,
  DmEuropeCasesVerification: DmEuropeCasesVerification,
  DmEuropePaymentAdjustments: DmEuropePaymentAdjustments,
  DmEuropePaymentOperations: DmEuropePaymentOperations,
  DmEuropeVendorsPayments: DmEuropeVendorsPayments,
  DmEvaluations: DmEvaluations,
  DmEvaluationsSkills: DmEvaluationsSkills,
  DmExpense: DmExpense,
  DmExpenseCash: DmExpenseCash,
  DmExpenseCashRecord: DmExpenseCashRecord,
  DmFee: DmFee,
  DmFinanceInvoice: DmFinanceInvoice,
  DmForm4687: DmForm4687,
  DmForm4688: DmForm4688,
  DmForm4689: DmForm4689,
  DmForm4690: DmForm4690,
  DmForm4691: DmForm4691,
  DmForm4695: DmForm4695,
  DmGaryContract: DmGaryContract,
  DmGroups: DmGroups,
  DmHourlyLeadCounts: DmHourlyLeadCounts,
  DmJobSearchQualification: DmJobSearchQualification,
  DmJsOpsCompanyInterview: DmJsOpsCompanyInterview,
  DmJsOpsLangProf: DmJsOpsLangProf,
  DmJsOpsMonthlyStatus: DmJsOpsMonthlyStatus,
  DmJsOpsNomination: DmJsOpsNomination,
  DmJsOpsPrescreening: DmJsOpsPrescreening,
  DmJsResumeWriting: DmJsResumeWriting,
  DmLeadsEmailers: DmLeadsEmailers,
  DmLeadCounts: DmLeadCounts,
  DmLeadLiveChatCounts: DmLeadLiveChatCounts,
  DmLeadLpCounts: DmLeadLpCounts,
  DmLeadRoundRobinState: DmLeadRoundRobinState,
  DmLeadShjCounts: DmLeadShjCounts,
  DmLeaveHistory: DmLeaveHistory,
  DmLeaveType: DmLeaveType,
  DmLibrary: DmLibrary,
  DmLibraryFolders: DmLibraryFolders,
  DmLiveChatLeads: DmLiveChatLeads,
  DmLmiaBrief: DmLmiaBrief,
  DmLmiaPaymentAdjustments: DmLmiaPaymentAdjustments,
  DmLogs: DmLogs,
  DmNewClient: DmNewClient,
  DmObservationFile: DmObservationFile,
  DmOfficialEmails: DmOfficialEmails,
  DmOldData: DmOldData,
  DmOldPayment: DmOldPayment,
  DmOperationAllocations: DmOperationAllocations,
  DmOperationStageData: DmOperationStageData,
  DmOpportunityComplianceApprovals: DmOpportunityComplianceApprovals,
  DmOpsBusinessDocuments: DmOpsBusinessDocuments,
  DmOpsBusinessDos: DmOpsBusinessDos,
  DmOpsBusinesCanada: DmOpsBusinesCanada,
  DmOpsBusinesPoland: DmOpsBusinesPoland,
  DmOpsBusinesUk: DmOpsBusinesUk,
  DmOpsBusinesUsa: DmOpsBusinesUsa,
  DmOpsConversation: DmOpsConversation,
  DmOpsConversationOld: DmOpsConversationOld,
  DmOpsDocuments: DmOpsDocuments,
  DmOpsDocumentsOld: DmOpsDocumentsOld,
  DmOpsLangProf: DmOpsLangProf,
  DmOpsLangProfOld: DmOpsLangProfOld,
  DmOpsLangProfSpouse: DmOpsLangProfSpouse,
  DmOpsLangProfSpouseOld: DmOpsLangProfSpouseOld,
  DmOpsLmia: DmOpsLmia,
  DmOpsMedicalRequest: DmOpsMedicalRequest,
  DmOpsPolandApplication: DmOpsPolandApplication,
  DmOpsPolandJol: DmOpsPolandJol,
  DmOpsPolandLoc: DmOpsPolandLoc,
  DmOpsSkillAustralia: DmOpsSkillAustralia,
  DmOpsSkillAustraliaAssess: DmOpsSkillAustraliaAssess,
  DmOpsSkillAustraliaAssessOld: DmOpsSkillAustraliaAssessOld,
  DmOpsSkillAustraliaAssessSpouse: DmOpsSkillAustraliaAssessSpouse,
  DmOpsSkillAustraliaAssessSpouseOld: DmOpsSkillAustraliaAssessSpouseOld,
  DmOpsSkillAustraliaOld: DmOpsSkillAustraliaOld,
  DmOpsSkillCanadaEca: DmOpsSkillCanadaEca,
  DmOpsSkillCanadaEe: DmOpsSkillCanadaEe,
  DmOpsSkillCanadaIta: DmOpsSkillCanadaIta,
  DmOpsSkillCanadaOld: DmOpsSkillCanadaOld,
  DmOpsStudentVisa: DmOpsStudentVisa,
  DmOpsUpdatedBy: DmOpsUpdatedBy,
  DmOpsVisitVisa: DmOpsVisitVisa,
  DmOpsVisitVisaApplication: DmOpsVisitVisaApplication,
  DmOpTeamAllocations: DmOpTeamAllocations,
  DmcOpportunities: DmcOpportunities,
  DmcOpportunityQuotations: DmcOpportunityQuotations,
  DmcQuotationItems: DmcQuotationItems,
  DmcOpportunityPayments: DmcOpportunityPayments,
  DmcOpportunityDocuments: DmcOpportunityDocuments,
  DmcOpportunityAgreements: DmcOpportunityAgreements,
  DmcOpportunityActivities: DmcOpportunityActivities,
  DmcDiscountApprovals: DmcDiscountApprovals,
  DmcLeadReassignments: DmcLeadReassignments,
  DmcNotifications: DmcNotifications,
  DmcFollowUpReminders: DmcFollowUpReminders,
  DmcMeetingSchedules: DmcMeetingSchedules,
  DmPayHistory: DmPayHistory,
  DmPayHistoryCrossBranch: DmPayHistoryCrossBranch,
  DmPnp: DmPnp,
  DmPnpOld: DmPnpOld,
  DmPolandWorkPermit: DmPolandWorkPermit,
  DmPolBiometrics: DmPolBiometrics,
  DmPermission: DmPermission,
  DmProgramType: DmProgramType,
  DmProspectDocuments: DmProspectDocuments,
  DmProspectRemarks: DmProspectRemarks,
  DmProspects: DmProspects,
  DmRefunds: DmRefunds,
  DmRegion: DmRegion,
  DmRole: DmRole,
  DmRolePermission: DmRolePermission,
  DmService: DmService,
  DmSource: DmSource,
  DmStages: DmStages,
  DmSuccessStories: DmSuccessStories,
  DmSuccessStoriesFolder: DmSuccessStoriesFolder,
  DmSvAdmissions: DmSvAdmissions,
  DmSvCic: DmSvCic,
  DmSvCredentials: DmSvCredentials,
  DmTargetDates: DmTargetDates,
  DmTask: DmTask,
  DmTeams: DmTeams,
  DmThirdPartyPayments: DmThirdPartyPayments,
  DmTrainingUpdates: DmTrainingUpdates,
  DmUserBranches: DmUserBranches,
  DmUserTeams: DmUserTeams,
  DmVendors: DmVendors,
  DmVendorDocuments: DmVendorDocuments,
  DmVendorInvoice: DmVendorInvoice,
  DmVvApplicantFees: DmVvApplicantFees,
  DmVvBiometrics: DmVvBiometrics,
  DmVvCredentials: DmVvCredentials,
  DmWelcomeEmail: DmWelcomeEmail,
  DmWelcomeEmailDocs: DmWelcomeEmailDocs,
  DmWpCases: DmWpCases,
  DmWpFee: DmWpFee,
  Ecacredentials: Ecacredentials,
  EcacredentialsOld: EcacredentialsOld,
  EcacredentialsSpouse: EcacredentialsSpouse,
  EcacredentialsSpouseOld: EcacredentialsSpouseOld,
  Eecredentials: Eecredentials,
  EecredentialsOld: EecredentialsOld,
  Eeprofile: Eeprofile,
  EeprofileOld: EeprofileOld,
  EscalationLogs: EscalationLogs,
  ExpenseType: ExpenseType,
  GaryProspectss: GaryProspectss,
  GaryWorkDocs: GaryWorkDocs,
  Ielts: Ielts,
  IeltsReport: IeltsReport,
  Itaremarks: Itaremarks,
  LeadLogs: LeadLogs,
  LeadShuffleLogs: LeadShuffleLogs,
  LpLeads: LpLeads,
  MasterSheets: MasterSheets,
  MasterSheetsECA: MasterSheetsECA,
  MasterSheetsEIP: MasterSheetsEIP,
  MasterSheetsEoiAustralia: MasterSheetsEoiAustralia,
  MasterSheetsEU: MasterSheetsEU,
  MasterSheetsITA: MasterSheetsITA,
  MasterSheetsPNP: MasterSheetsPNP,
  MasterSheetsSA: MasterSheetsSA,
  MasterSheetsSkillAssessment: MasterSheetsSkillAssessment,
  MasterSheetsVV: MasterSheetsVV,
  MasterSheetsXPS: MasterSheetsXPS,
  OldData1: OldData1,
  OldData2: OldData2,
  OldDataAuh: OldDataAuh,
  OldDataPun: OldDataPun,
  OldDataShj: OldDataShj,
  OpsBusinessRemarks: OpsBusinessRemarks,
  OpsLogs: OpsLogs,
  OpsRemarks: OpsRemarks,
  OpsRemarksOld: OpsRemarksOld,
  Qualification: Qualification,
  QualificationOld: QualificationOld,
  QualificationSpouse: QualificationSpouse,
  QualificationSpouseOld: QualificationSpouseOld,
  StudentLeadsLogs: StudentLeadsLogs,
  Target: Target,
  TaskRemarks: TaskRemarks,
  WpCf7db2916: WpCf7db2916,
  WpCf7db3232: WpCf7db3232,
  WpCf7db3284: WpCf7db3284,
  WpCf7db3606: WpCf7db3606,
  WpCf7db3848: WpCf7db3848,
  WpCf7db3870: WpCf7db3870,
  WpCf7db3881: WpCf7db3881,
  WpCf7db4077: WpCf7db4077,
  WpCf7db4086: WpCf7db4086,
  WpCf7db5499: WpCf7db5499,
  WpCf7db5500: WpCf7db5500,
  HrAttendanceRecord,
  HrEmployeeDocument,
  HrEmployeeLetter,
  HrEosbSettlement,
  HrExitChecklist,
  HrExitChecklistItem,
  HrExitInterview,
  HrHeadcountSnapshot,
  HrLeaveBalance,
  HrLeaveRequest,
  HrLetterTemplate,
  HrPayslip,
  NotificationLog,
  ProCompany,
  ProDocument,
  ProEmployeeImmigration,
  ProGccBranchDocument,
  ProInsuranceRecord,
  ProMonthlyTask,
  ProOwnerDocument,
  ProWpsRecord,
  DmOpportunityWorkflowReview,
  DmOpportunityWorkflowAuditLog,
  DmOpportunityHandoverNote,
  DmOpportunityAccountingVerification,
  DmClientUploadPortal,
  DmClientUploadChecklistItem,
  DmOpportunityPaymentSchedule,
};

type ModelWithAssociate = {
  associate?: (registeredModels: Record<string, unknown>) => void;
};

Object.values(models).forEach((model) => {
  const associableModel = model as ModelWithAssociate;
  if (associableModel.associate) {
    associableModel.associate(models);
  }
});

export { sequelize, models };
export { Appointments } from './Appointments';
export type { AppointmentsAttributes, AppointmentsCreationAttributes } from './Appointments';
export { AppointmentCounteries } from './AppointmentCounteries';
export { AuditorFollowups } from './AuditorFollowups';
export { AuditorMeetings } from './AuditorMeetings';
export { AusEoi } from './AusEoi';
export { AusEoiOld } from './AusEoiOld';
export { AusNom } from './AusNom';
export { AusNomOld } from './AusNomOld';
export { BranchTarget } from './BranchTarget';
export { BusinessAssPayment } from './BusinessAssPayment';
export { CanadaStatus } from './CanadaStatus';
export { ClientStatus } from './ClientStatus';
export { ClientStatusOld } from './ClientStatusOld';
export { DmcAuhEmailLeads } from './DmcAuhEmailLeads';
export { DmcAutoReassignmentRules } from './DmcAutoReassignmentRules';
export type { DmcAutoReassignmentRulesAttributes, DmcAutoReassignmentRulesCreationAttributes } from './DmcAutoReassignmentRules';
export { DmcAutoReassignmentRuns } from './DmcAutoReassignmentRuns';
export type { DmcAutoReassignmentRunsAttributes, DmcAutoReassignmentRunsCreationAttributes } from './DmcAutoReassignmentRuns';
export { DmcForumEmailLeads } from './DmcForumEmailLeads';
export { DmcForumLeads } from './DmcForumLeads';
export type { DmcForumLeadsAttributes } from './DmcForumLeads';
export { DmcForumLeadsAssesments } from './DmcForumLeadsAssesments';
export { DmcForumLeadsAssesmentDesgn } from './DmcForumLeadsAssesmentDesgn';
export { DmcForumLeadsAssesmentEdu } from './DmcForumLeadsAssesmentEdu';
export { DmcForumLeadsContracts } from './DmcForumLeadsContracts';
export type { DmcForumLeadsContractsAttributes } from './DmcForumLeadsContracts';
export { DmcForumLeadsFee } from './DmcForumLeadsFee';
export type { DmcForumLeadsFeeAttributes } from './DmcForumLeadsFee';
export { DmcForumLeadsObservations } from './DmcForumLeadsObservations';
export { DmcForumLeadsObservationOld } from './DmcForumLeadsObservationOld';
export { DmcForumLeadsRemarks } from './DmcForumLeadsRemarks';
export { DmcForumLeadsRemarkG } from './DmcForumLeadsRemarkG';
export { DmcForumLeadsRemarkOlds } from './DmcForumLeadsRemarkOlds';
export { DmcNewAddLeads } from './DmcNewAddLeads';
export { DmcNewAddPoLeads } from './DmcNewAddPoLeads';
export { Dm3partyPayment } from './Dm3partyPayment';
export type { Dm3partyPaymentAttributes } from './Dm3partyPayment';
export { Dm3partyPaymentDet } from './Dm3partyPaymentDet';
export { Dm3partyPaymentOld } from './Dm3partyPaymentOld';
export { DmAccounts } from './DmAccounts';
export type { DmAccountsAttributes } from './DmAccounts';
export { DmAdditionalDocuments } from './DmAdditionalDocuments';
export { DmAdmin } from './DmAdmin';
export { DmAppointments } from './DmAppointments';
export { DmAppointmentRemarks } from './DmAppointmentRemarks';
export { DmAuditorCounts } from './DmAuditorCounts';
export { DmAuditorReviews } from './DmAuditorReviews';
export { DmB2b } from './DmB2b';
export type { DmB2bAttributes } from './DmB2b';
export { DmB2bInvoices } from './DmB2bInvoices';
export type { DmB2bInvoicesAttributes } from './DmB2bInvoices';
export { DmBatch } from './DmBatch';
export { DmBranch } from './DmBranch';
export type { DmBranchAttributes } from './DmBranch';
export { DmBranchAllocations } from './DmBranchAllocations';
export { DmBusinessFee } from './DmBusinessFee';
export { DmBusinessPaymentPlan } from './DmBusinessPaymentPlan';
export { DmBusinessPortugalPaymentPlan } from './DmBusinessPortugalPaymentPlan';
export { DmCampaigns } from './DmCampaigns';
export type { DmCampaignsAttributes } from './DmCampaigns';
export { DmCf7db2916 } from './DmCf7db2916';
export { DmCf7db3232 } from './DmCf7db3232';
export { DmCf7db3606 } from './DmCf7db3606';
export { DmCf7db3848 } from './DmCf7db3848';
export { DmCf7db3870 } from './DmCf7db3870';
export { DmCf7db4077 } from './DmCf7db4077';
export { DmCf7db4088 } from './DmCf7db4088';
export { DmClients } from './DmClients';
export type { DmClientsAttributes } from './DmClients';
export { DmClientConversations } from './DmClientConversations';
export { DmClientEdu } from './DmClientEdu';
export { DmClientLogs } from './DmClientLogs';
export { DmClientPersonal } from './DmClientPersonal';
export { DmClientPersonalOld } from './DmClientPersonalOld';
export { DmCommercialInvoices } from './DmCommercialInvoices';
export { DmContractFile } from './DmContractFile';
export { DmCounsilorAllocations } from './DmCounsilorAllocations';
export { DmCountries } from './DmCountries';
export type { DmCountriesAttributes } from './DmCountries';
export { DmCountriesTypeProgram } from './DmCountriesTypeProgram';
export { DmCountryProces } from './DmCountryProces';
export { DmCurrency } from './DmCurrency';
export { DmDepartment } from './DmDepartment';
export type { DmDepartmentAttributes, DmDepartmentCreationAttributes } from './DmDepartment';
export { DmDupLiveChatLeads } from './DmDupLiveChatLeads';
export { DmDupLpLeads } from './DmDupLpLeads';
export { DmEipAipp } from './DmEipAipp';
export { DmEipMcdii } from './DmEipMcdii';
export { DmEipRnip } from './DmEipRnip';
export { DmEmailAttachments } from './DmEmailAttachments';
export { DmEmailTemplates } from './DmEmailTemplates';
export { DmEmployee } from './DmEmployee';
export type { DmEmployeeAttributes } from './DmEmployee';
export { DmEmployeeAttendance } from './DmEmployeeAttendance';
export type { DmEmployeeAttendanceAttributes } from './DmEmployeeAttendance';
export { DmEmployeeLogs } from './DmEmployeeLogs';
export { DmEmployeeLogsOld } from './DmEmployeeLogsOld';
export { DmEmployer } from './DmEmployer';
export type { DmEmployerAttributes, DmEmployerCreationAttributes } from './DmEmployer';
export { DmEmpSims } from './DmEmpSims';
export { DmEmpStocks } from './DmEmpStocks';
export { DmEnquiry } from './DmEnquiry';
export { DmEuropeCases } from './DmEuropeCases';
export { DmEuropeCasesVerification } from './DmEuropeCasesVerification';
export { DmEuropePaymentAdjustments } from './DmEuropePaymentAdjustments';
export { DmEuropePaymentOperations } from './DmEuropePaymentOperations';
export { DmEuropeVendorsPayments } from './DmEuropeVendorsPayments';
export { DmEvaluations } from './DmEvaluations';
export { DmEvaluationsSkills } from './DmEvaluationsSkills';
export { DmExpense } from './DmExpense';
export { DmExpenseCash } from './DmExpenseCash';
export { DmExpenseCashRecord } from './DmExpenseCashRecord';
export { DmFee } from './DmFee';
export { DmFinanceInvoice } from './DmFinanceInvoice';
export { DmForm4687 } from './DmForm4687';
export { DmForm4688 } from './DmForm4688';
export { DmForm4689 } from './DmForm4689';
export { DmForm4690 } from './DmForm4690';
export { DmForm4691 } from './DmForm4691';
export { DmForm4695 } from './DmForm4695';
export { DmGaryContract } from './DmGaryContract';
export { DmGroups } from './DmGroups';
export { DmHourlyLeadCounts } from './DmHourlyLeadCounts';
export { DmJobSearchQualification } from './DmJobSearchQualification';
export { DmJsOpsCompanyInterview } from './DmJsOpsCompanyInterview';
export { DmJsOpsLangProf } from './DmJsOpsLangProf';
export { DmJsOpsMonthlyStatus } from './DmJsOpsMonthlyStatus';
export { DmJsOpsNomination } from './DmJsOpsNomination';
export { DmJsOpsPrescreening } from './DmJsOpsPrescreening';
export { DmJsResumeWriting } from './DmJsResumeWriting';
export { DmLeadsEmailers } from './DmLeadsEmailers';
export { DmLeadCounts } from './DmLeadCounts';
export { DmLeadLiveChatCounts } from './DmLeadLiveChatCounts';
export { DmLeadLpCounts } from './DmLeadLpCounts';
export { DmLeadRoundRobinState } from './DmLeadRoundRobinState';
export type { DmLeadRoundRobinStateAttributes, DmLeadRoundRobinStateCreationAttributes } from './DmLeadRoundRobinState';
export { DmLeadShjCounts } from './DmLeadShjCounts';
export { DmLeaveHistory } from './DmLeaveHistory';
export { DmLeaveType } from './DmLeaveType';
export { DmLibrary } from './DmLibrary';
export { DmLibraryFolders } from './DmLibraryFolders';
export { DmLiveChatLeads } from './DmLiveChatLeads';
export { DmLmiaBrief } from './DmLmiaBrief';
export { DmLmiaPaymentAdjustments } from './DmLmiaPaymentAdjustments';
export { DmLogs } from './DmLogs';
export { DmNewClient } from './DmNewClient';
export { DmObservationFile } from './DmObservationFile';
export { DmOfficialEmails } from './DmOfficialEmails';
export { DmOldData } from './DmOldData';
export { DmOldPayment } from './DmOldPayment';
export { DmOperationAllocations } from './DmOperationAllocations';
export { DmOperationStageData } from './DmOperationStageData';
export type { DmOperationStageDataAttributes, DmOperationStageDataCreationAttributes } from './DmOperationStageData';
export { DmOpportunityComplianceApprovals } from './DmOpportunityComplianceApprovals';
export type { DmOpportunityComplianceApprovalsAttributes, DmOpportunityComplianceApprovalsCreationAttributes } from './DmOpportunityComplianceApprovals';
export { DmOpsBusinessDocuments } from './DmOpsBusinessDocuments';
export { DmOpsBusinessDos } from './DmOpsBusinessDos';
export { DmOpsBusinesCanada } from './DmOpsBusinesCanada';
export { DmOpsBusinesPoland } from './DmOpsBusinesPoland';
export { DmOpsBusinesUk } from './DmOpsBusinesUk';
export { DmOpsBusinesUsa } from './DmOpsBusinesUsa';
export { DmOpsConversation } from './DmOpsConversation';
export { DmOpsConversationOld } from './DmOpsConversationOld';
export { DmOpsDocuments } from './DmOpsDocuments';
export { DmOpsDocumentsOld } from './DmOpsDocumentsOld';
export { DmOpsLangProf } from './DmOpsLangProf';
export { DmOpsLangProfOld } from './DmOpsLangProfOld';
export { DmOpsLangProfSpouse } from './DmOpsLangProfSpouse';
export { DmOpsLangProfSpouseOld } from './DmOpsLangProfSpouseOld';
export { DmOpsLmia } from './DmOpsLmia';
export { DmOpsMedicalRequest } from './DmOpsMedicalRequest';
export { DmOpsPolandApplication } from './DmOpsPolandApplication';
export { DmOpsPolandJol } from './DmOpsPolandJol';
export { DmOpsPolandLoc } from './DmOpsPolandLoc';
export { DmOpsSkillAustralia } from './DmOpsSkillAustralia';
export { DmOpsSkillAustraliaAssess } from './DmOpsSkillAustraliaAssess';
export { DmOpsSkillAustraliaAssessOld } from './DmOpsSkillAustraliaAssessOld';
export { DmOpsSkillAustraliaAssessSpouse } from './DmOpsSkillAustraliaAssessSpouse';
export { DmOpsSkillAustraliaAssessSpouseOld } from './DmOpsSkillAustraliaAssessSpouseOld';
export { DmOpsSkillAustraliaOld } from './DmOpsSkillAustraliaOld';
export { DmOpsSkillCanadaEca } from './DmOpsSkillCanadaEca';
export { DmOpsSkillCanadaEe } from './DmOpsSkillCanadaEe';
export { DmOpsSkillCanadaIta } from './DmOpsSkillCanadaIta';
export { DmOpsSkillCanadaOld } from './DmOpsSkillCanadaOld';
export { DmOpsStudentVisa } from './DmOpsStudentVisa';
export { DmOpsUpdatedBy } from './DmOpsUpdatedBy';
export { DmOpsVisitVisa } from './DmOpsVisitVisa';
export { DmOpsVisitVisaApplication } from './DmOpsVisitVisaApplication';
export { DmOpTeamAllocations } from './DmOpTeamAllocations';
export { DmPayHistory } from './DmPayHistory';
export { DmPayHistoryCrossBranch } from './DmPayHistoryCrossBranch';
export { DmPnp } from './DmPnp';
export { DmPnpOld } from './DmPnpOld';
export { DmPolandWorkPermit } from './DmPolandWorkPermit';
export { DmPolBiometrics } from './DmPolBiometrics';
export { DmPermission } from './DmPermission';
export type { DmPermissionAttributes, DmPermissionCreationAttributes } from './DmPermission';
export { DmProgramType } from './DmProgramType';
export { DmProspectDocuments } from './DmProspectDocuments';
export type { DmProspectDocumentsAttributes, DmProspectDocumentsCreationAttributes } from './DmProspectDocuments';
export { DmProspectRemarks } from './DmProspectRemarks';
export type { DmProspectRemarksAttributes, DmProspectRemarksCreationAttributes } from './DmProspectRemarks';
export { DmProspects } from './DmProspects';
export type { DmProspectsAttributes, DmProspectsCreationAttributes } from './DmProspects';
export { DmRefunds } from './DmRefunds';
export { DmRegion } from './DmRegion';
export { DmRole } from './DmRole';
export { DmRolePermission } from './DmRolePermission';
export type { DmRolePermissionAttributes, DmRolePermissionCreationAttributes } from './DmRolePermission';
export { DmService } from './DmService';
export type { DmServiceAttributes, DmServiceCreationAttributes } from './DmService';
export { DmSource } from './DmSource';
export type { DmSourceAttributes, DmSourceCreationAttributes } from './DmSource';
export { DmStages } from './DmStages';
export { DmSuccessStories } from './DmSuccessStories';
export { DmSuccessStoriesFolder } from './DmSuccessStoriesFolder';
export { DmSvAdmissions } from './DmSvAdmissions';
export { DmSvCic } from './DmSvCic';
export { DmSvCredentials } from './DmSvCredentials';
export { DmTargetDates } from './DmTargetDates';
export { DmTask } from './DmTask';
export { DmTeams } from './DmTeams';
export { DmThirdPartyPayments } from './DmThirdPartyPayments';
export { DmTrainingUpdates } from './DmTrainingUpdates';
export { DmUserBranches } from './DmUserBranches';
export { DmUserTeams } from './DmUserTeams';
export { DmVendors } from './DmVendors';
export { DmVendorDocuments } from './DmVendorDocuments';
export { DmVendorInvoice } from './DmVendorInvoice';
export { DmVvApplicantFees } from './DmVvApplicantFees';
export { DmVvBiometrics } from './DmVvBiometrics';
export { DmVvCredentials } from './DmVvCredentials';
export { DmWelcomeEmail } from './DmWelcomeEmail';
export { DmWelcomeEmailDocs } from './DmWelcomeEmailDocs';
export { DmWpCases } from './DmWpCases';
export { DmWpFee } from './DmWpFee';
export { Ecacredentials } from './Ecacredentials';
export { EcacredentialsOld } from './EcacredentialsOld';
export { EcacredentialsSpouse } from './EcacredentialsSpouse';
export { EcacredentialsSpouseOld } from './EcacredentialsSpouseOld';
export { Eecredentials } from './Eecredentials';
export { EecredentialsOld } from './EecredentialsOld';
export { Eeprofile } from './Eeprofile';
export { EeprofileOld } from './EeprofileOld';
export { EscalationLogs } from './EscalationLogs';
export { ExpenseType } from './ExpenseType';
export { GaryProspectss } from './GaryProspectss';
export { GaryWorkDocs } from './GaryWorkDocs';
export { Ielts } from './Ielts';
export { IeltsReport } from './IeltsReport';
export { Itaremarks } from './Itaremarks';
export { LeadLogs } from './LeadLogs';
export { LeadShuffleLogs } from './LeadShuffleLogs';
export { LpLeads } from './LpLeads';
export { MasterSheets } from './MasterSheets';
export { MasterSheetsECA } from './MasterSheetsECA';
export { MasterSheetsEIP } from './MasterSheetsEIP';
export { MasterSheetsEoiAustralia } from './MasterSheetsEoiAustralia';
export { MasterSheetsEU } from './MasterSheetsEU';
export { MasterSheetsITA } from './MasterSheetsITA';
export { MasterSheetsPNP } from './MasterSheetsPNP';
export { MasterSheetsSA } from './MasterSheetsSA';
export { MasterSheetsSkillAssessment } from './MasterSheetsSkillAssessment';
export { MasterSheetsVV } from './MasterSheetsVV';
export { MasterSheetsXPS } from './MasterSheetsXPS';
export { OldData1 } from './OldData1';
export { OldData2 } from './OldData2';
export { OldDataAuh } from './OldDataAuh';
export { OldDataPun } from './OldDataPun';
export { OldDataShj } from './OldDataShj';
export { OpsBusinessRemarks } from './OpsBusinessRemarks';
export { OpsLogs } from './OpsLogs';
export { OpsRemarks } from './OpsRemarks';
export { OpsRemarksOld } from './OpsRemarksOld';
export { Qualification } from './Qualification';
export { QualificationOld } from './QualificationOld';
export { QualificationSpouse } from './QualificationSpouse';
export { QualificationSpouseOld } from './QualificationSpouseOld';
export { StudentLeadsLogs } from './StudentLeadsLogs';
export { Target } from './Target';
export { TaskRemarks } from './TaskRemarks';
export { WpCf7db2916 } from './WpCf7db2916';
export { WpCf7db3232 } from './WpCf7db3232';
export { WpCf7db3284 } from './WpCf7db3284';
export { WpCf7db3606 } from './WpCf7db3606';
export { WpCf7db3848 } from './WpCf7db3848';
export { WpCf7db3870 } from './WpCf7db3870';
export { WpCf7db3881 } from './WpCf7db3881';
export { WpCf7db4077 } from './WpCf7db4077';
export { WpCf7db4086 } from './WpCf7db4086';
export { WpCf7db5499 } from './WpCf7db5499';
export { WpCf7db5500 } from './WpCf7db5500';

export { DmcOpportunities } from './DmcOpportunities';
export { DmcOpportunityQuotations } from './DmcOpportunityQuotations';
export { DmcQuotationItems } from './DmcQuotationItems';
export { DmcOpportunityPayments } from './DmcOpportunityPayments';
export { DmcOpportunityDocuments } from './DmcOpportunityDocuments';
export { DmcOpportunityAgreements } from './DmcOpportunityAgreements';
export { DmcOpportunityActivities } from './DmcOpportunityActivities';
export { DmcNotifications } from './DmcNotifications';
export { DmcFollowUpReminders } from './DmcFollowUpReminders';
export { DmcMeetingSchedules } from './DmcMeetingSchedules';
export { DmcDiscountApprovals } from './DmcDiscountApprovals';
export { DmcLeadReassignments } from './DmcLeadReassignments';
export {
  HrAttendanceRecord,
  HrEmployeeDocument,
  HrEmployeeLetter,
  HrEosbSettlement,
  HrExitChecklist,
  HrExitChecklistItem,
  HrExitInterview,
  HrHeadcountSnapshot,
  HrLeaveBalance,
  HrLeaveRequest,
  HrLetterTemplate,
  HrPayslip,
  NotificationLog,
  ProCompany,
  ProDocument,
  ProEmployeeImmigration,
  ProGccBranchDocument,
  ProInsuranceRecord,
  ProMonthlyTask,
  ProOwnerDocument,
  ProWpsRecord,
} from './HrProModels';

// Legacy-friendly aliases used in older service layers
export { DmcForumLeads as Lead } from './DmcForumLeads';
export { DmEmployee as Employee } from './DmEmployee';
export { DmBranch as Branch } from './DmBranch';
export { DmRegion as Region } from './DmRegion';
export { DmProgramType as Program } from './DmProgramType';
export { DmFee as Fee } from './DmFee';
export { DmCurrency as Currency } from './DmCurrency';
export { DmRole as Role } from './DmRole';
export { DmSource as MarketSource } from './DmSource';

// CRM Process Flow models
export { DmOpportunityWorkflowReview } from './DmOpportunityWorkflowReview';
export type { DmOpportunityWorkflowReviewAttributes } from './DmOpportunityWorkflowReview';
export { DmOpportunityWorkflowAuditLog } from './DmOpportunityWorkflowAuditLog';
export type { DmOpportunityWorkflowAuditLogAttributes } from './DmOpportunityWorkflowAuditLog';
export { DmOpportunityHandoverNote } from './DmOpportunityHandoverNote';
export type { DmOpportunityHandoverNoteAttributes } from './DmOpportunityHandoverNote';
export { DmOpportunityAccountingVerification } from './DmOpportunityAccountingVerification';
export type { DmOpportunityAccountingVerificationAttributes } from './DmOpportunityAccountingVerification';
export { DmClientUploadPortal } from './DmClientUploadPortal';
export type { DmClientUploadPortalAttributes } from './DmClientUploadPortal';
export { DmClientUploadChecklistItem } from './DmClientUploadChecklistItem';
export type { DmClientUploadChecklistItemAttributes } from './DmClientUploadChecklistItem';
export { DmOpportunityPaymentSchedule } from './DmOpportunityPaymentSchedule';
export type { DmOpportunityPaymentScheduleAttributes } from './DmOpportunityPaymentSchedule';
