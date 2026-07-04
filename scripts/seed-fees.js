const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/dmconsultant_mydmcons_dm';
const parsedUrl = new URL(databaseUrl);
const database = parsedUrl.pathname.replace(/^\//, '');

const baseConfig = {
  host: parsedUrl.hostname || 'localhost',
  port: Number(parsedUrl.port || 3306),
  user: decodeURIComponent(parsedUrl.username || 'root'),
  password: decodeURIComponent(parsedUrl.password || ''),
  multipleStatements: false,
};

const BRANCH_ABBRV = { AUH: 'AUH', DXB: 'DXB SZR', KWT: 'KWD', QTR: 'DOH old airport rd', HYD: 'HYD' };

// New countries that don't exist in dm_country_proces by default.
const NEW_COUNTRIES = ['Belgium', 'Finland', 'Greece', 'GCC', 'China'];

// Existing dm_country_proces name -> id (matches the stock seed data this project ships with).
const COUNTRY = {
  'Australia': 1, 'Canada': 2, 'United Kingdom': 3, 'USA': 4, 'Poland': 5,
  'Germany': 8, 'Dominica': 10, 'France': 12, 'Italy': 13, 'New Zealand': 14,
  'Spain': 15, 'Sweden': 16, 'Ireland': 17, 'Schengen': 18, 'St. Kitts & Nevis': 22,
  'Singapore': 23, 'Portugal': 26, 'Europe': 27, 'Malta': 28, 'Thailand': 29,
  'St. Lucia': 31, 'Czech Republic': 34, 'Japan': 40,
};

// dm_program_type: 1=Business, 2=Skill, 3=Student, 4=Visit, 5=Work, 6=Business CBI, 7=Business RBI, 8=Regular
function classifyProgramType(name) {
  const n = name.toLowerCase();
  if (n.includes('student')) return 3;
  if (n.includes('citizenship') || n.includes('golden visa') || n.includes('investor') || /st\.\s*kitts|st\.\s*lucia|dominica/.test(n) || n.includes('eb5') || n.includes('eb-5')) return 6;
  if (n.includes('resume marketing')) return 8;
  if (n.includes('job search') || n.includes('job seeker') || n.includes('opportunity card') || n.includes('work permit') || n.includes('work visa') || n.includes('nursing') || n.includes('nomad')) return 5;
  if (n.includes('visit visa') || n.includes('tourist') || n.includes('dependent') || n.includes('super visa') || n.includes('fastrack')) return 4;
  return 2;
}

// [programCode, subCategory, countryNameOrNull, branchKey, currency, upfront, profUp, m1,m2,m3,profMo, s1,s2,s3,s4,s5, profSt]
const FEE_ROWS = [
['1001','Canada PA & Spouse','Canada','AUH',7,11900,1500,6500,3000,1500,1500,8200,6300,0,0,0,0],
['1001','Canada PA & Spouse','Canada','DXB',7,11900,1500,6500,3000,1500,1500,8200,6300,0,0,0,0],
['1001','Canada PA & Spouse','Canada','KWT',6,990,90,750,250,150,100,900,550,0,0,0,0],
['1001','Canada PA & Spouse','Canada','QTR',5,11900,1500,6500,3000,1500,1500,8200,6300,0,0,0,0],
['1001','Canada Single','Canada','AUH',7,9900,1500,4500,3000,1500,1500,6200,5300,0,0,0,0],
['1001','Canada Single','Canada','DXB',7,9900,1500,4500,3000,1500,1500,6200,5300,0,0,0,0],
['1001','Canada Single','Canada','HYD',3,100000,15000,40000,40000,25000,15000,65000,50000,0,0,0,15000],
['1001','Canada Single','Canada','KWT',6,890,90,500,250,150,100,650,500,0,0,0,0],
['1001','Canada Single','Canada','QTR',5,9900,1500,4500,3000,1500,1500,6200,5300,0,0,0,0],
['1002','Canada ECA - PA & Spouse','Canada','AUH',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - PA & Spouse','Canada','DXB',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - PA & Spouse','Canada','KWT',6,400,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - PA & Spouse','Canada','QTR',5,3500,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - Single','Canada','AUH',7,3000,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - Single','Canada','DXB',7,3000,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - Single','Canada','KWT',6,390,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada ECA - Single','Canada','QTR',5,3000,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada Post ECA - PA & Spouse','Canada','AUH',7,8500,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada Post ECA - PA & Spouse','Canada','DXB',7,8500,0,0,0,0,0,8200,4000,0,0,0,0],
['1002','Canada Post ECA - PA & Spouse','Canada','KWT',6,900,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada Post ECA - PA & Spouse','Canada','QTR',5,8500,0,0,0,0,0,0,0,0,0,0,0],
['1002','Canada Post ECA- Single','Canada','AUH',7,6500,1000,0,0,0,0,4000,4000,6000,4000,0,0],
['1002','Canada Post ECA- Single','Canada','DXB',7,6500,0,0,0,0,0,5000,5000,0,0,0,0],
['1002','Canada Post ECA- Single','Canada','HYD',3,60000,10000,30000,40000,0,0,20000,20000,20000,20000,0,0],
['1002','Canada Post ECA- Single','Canada','KWT',6,750,100,0,0,0,0,0,0,0,0,0,0],
['1002','Canada Post ECA- Single','Canada','QTR',5,6500,1000,0,0,0,0,4000,4000,6000,4000,0,0],
['1003','Alberta Tech Pathway','Canada','AUH',7,0,0,0,0,0,0,15000,15000,25000,10000,0,0],
['1003','Alberta Tech Pathway','Canada','DXB',7,0,0,0,0,0,0,15000,15000,20000,15000,0,0],
['1003','Alberta Tech Pathway','Canada','KWT',6,0,0,0,0,0,0,15000,15000,25000,10000,0,0],
['1003','Alberta Tech Pathway','Canada','QTR',5,0,0,0,0,0,0,15000,15000,25000,10000,0,0],
['1003','Canada OINP Work Permit','Canada','DXB',7,0,0,0,0,0,0,27494,41240,54987,0,0,0],
['1003','Canada-Quebec Skill Worker Program','Canada','AUH',7,8500,1500,0,0,0,0,0,0,0,0,0,0],
['1003','Canada-Quebec Skill Worker Program','Canada','DXB',7,8500,1500,0,0,0,0,0,0,0,0,0,0],
['1003','Canada-Quebec Skill Worker Program','Canada','QTR',5,8500,1500,0,0,0,0,0,0,0,0,0,0],
['1003','Ontario Entrepreneur Stream(OINP)','Canada','DXB',7,0,0,0,0,0,0,4000,4000,4000,0,0,0],
['1003','PNP','Canada','AUH',7,8000,0,8500,0,0,0,6000,4000,0,0,0,0],
['1003','PNP','Canada','DXB',7,9900,0,0,0,0,0,6500,5500,0,0,0,0],
['1003','PNP','Canada','KWT',6,800,0,0,0,0,0,600,400,0,0,0,0],
['1003','PNP','Canada','QTR',5,8000,0,0,0,0,0,6000,4000,0,0,0,0],
['1003','PNP - Ontario Foreign Worker Stream','Canada','AUH',7,0,0,0,0,0,0,15000,15000,15000,15000,0,0],
['1003','PNP - Ontario Foreign Worker Stream','Canada','DXB',7,0,0,0,0,0,0,15000,10000,10000,8000,0,0],
['1003','PNP - Ontario Foreign Worker Stream','Canada','KWT',6,0,0,0,0,0,0,15000,15000,15000,10000,0,0],
['1003','PNP PR','Canada','DXB',7,0,0,0,0,0,0,10000,15000,20000,15000,0,0],
['1003','Provincial Immigration Program - AIP','Canada','AUH',7,0,0,0,0,0,0,5000,20000,20000,5000,0,0],
['1003','Provincial Immigration Program - AIP','Canada','DXB',7,0,0,0,0,0,0,5000,20000,20000,5000,0,0],
['1003','Provincial Immigration Program - AIP','Canada','KWT',6,0,0,0,0,0,0,5000,20000,20000,5000,0,0],
['1003','Provincial Immigration Program - AIP','Canada','QTR',5,0,0,0,0,0,0,5000,20000,20000,5000,0,0],
['1003','Provincial Nomination Program – PR Pathway','Canada','AUH',7,0,0,0,0,0,0,10000,35000,15000,10000,0,0],
['1003','Provincial Nomination Program – PR Pathway','Canada','DXB',7,0,0,0,0,0,0,10000,35000,15000,10000,0,0],
['1003','Rural Community Immigration Pilot','Canada','AUH',7,0,0,0,0,0,0,20000,10000,20000,20000,0,0],
['1003','Rural Community Immigration Pilot','Canada','DXB',7,0,0,0,0,0,0,1,1,15000,15000,8000,0],
['1003','Rural Community Immigration Pilot','Canada','KWT',6,0,0,0,0,0,0,3000,3000,3000,1500,1500,0],
['1003','Rural Community Immigration Pilot','Canada','QTR',5,0,0,0,0,0,0,20000,10000,20000,20000,0,0],
['1003','Rural Renewal Stream','Canada','AUH',7,0,0,0,0,0,0,15000,10000,14000,20000,0,0],
['1003','Rural Renewal Stream','Canada','DXB',7,0,0,0,0,0,0,15000,15000,25000,10000,0,0],
['1003','Rural Renewal Stream','Canada','KWT',6,0,0,0,0,0,0,15000,30000,15000,5000,0,0],
['1003','Rural Renewal Stream','Canada','QTR',5,0,0,0,0,0,0,15000,15000,10000,20000,0,0],
['1003','Rural Renewal Stream 30','Canada','AUH',7,30000,0,0,0,0,0,0,0,0,0,0,0],
['1003','Rural Renewal Stream 30','Canada','DXB',7,30000,0,0,0,0,0,0,0,0,0,0,0],
['1003','Rural Renewal Stream 30','Canada','KWT',6,30000,0,0,0,0,0,0,0,0,0,0,0],
['1003','SINP','Canada','AUH',7,4000,0,0,0,0,0,0,0,0,0,0,0],
['1003','SINP','Canada','DXB',7,9900,0,0,0,0,0,0,0,0,0,0,0],
['1003','SINP','Canada','KWT',6,335,0,0,0,0,0,0,0,0,0,0,0],
['1003','SINP','Canada','QTR',5,4000,0,0,0,0,0,0,0,0,0,0,0],
['1003','Saskatchewan','Canada','QTR',5,3800,0,0,0,0,0,0,0,0,0,0,0],
['1003','YUKON & RURAL Immigration program 10','Canada','AUH',7,4500,0,0,0,0,0,5000,4500,0,0,0,0],
['1003','YUKON & RURAL Immigration program 10','Canada','DXB',7,6500,0,0,0,0,0,0,0,0,0,0,0],
['1003','YUKON & RURAL Immigration program 10','Canada','QTR',5,4500,0,0,0,0,0,0,0,0,0,0,0],
['1003','Yukon Nomination Program','Canada','AUH',7,4000,0,0,0,0,0,4000,3500,0,0,0,0],
['1003','Yukon Nomination Program','Canada','DXB',7,4000,0,0,0,0,0,4000,3500,0,0,0,0],
['1003','Yukon Nomination Program','Canada','HYD',3,80000,0,0,0,0,0,70000,70000,0,0,0,0],
['1003','Yukon Nomination Program','Canada','KWT',6,335,0,0,0,0,0,330,300,0,0,0,0],
['1003','Yukon Nomination Program','Canada','QTR',5,4000,0,0,0,0,0,4000,3500,0,0,0,0],
['1005','Economic Immigration Program','Canada','AUH',7,7000,0,0,0,0,0,4000,3500,0,0,0,0],
['1005','Economic Immigration Program','Canada','DXB',7,7000,0,0,0,0,0,4000,3500,0,0,0,0],
['1005','Economic Immigration Program','Canada','KWT',6,735,0,0,0,0,0,375,375,0,0,0,0],
['1005','Economic Immigration Program','Canada','QTR',5,7000,0,0,0,0,0,4000,3500,0,0,0,0],
['1006','Canada Nursing - Work Permit','Canada','AUH',7,0,0,0,0,0,0,7000,7000,6000,0,0,0],
['1006','Canada Nursing - Work Permit','Canada','DXB',7,0,0,0,0,0,0,7000,7000,6000,0,0,0],
['1006','Canada Nursing - Work Permit','Canada','KWT',6,0,0,0,0,0,0,590,590,500,0,0,0],
['1006','Canada Nursing - Work Permit','Canada','QTR',5,0,0,0,0,0,0,7000,7000,6000,0,0,0],
['1007','Super Visa','Canada','DXB',7,6000,0,0,0,0,0,0,0,0,0,0,0],
['1007','Super Visa','Canada','KWT',6,890,0,0,0,0,0,0,0,0,0,0,0],
['1007','Super Visa','Canada','QTR',5,6000,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia PA and Spouse','Australia','AUH',7,13900,1500,0,0,0,0,0,0,0,0,0,0],
['1008','Australia PA and Spouse','Australia','DXB',7,13900,1500,0,0,0,0,8000,8000,0,0,0,0],
['1008','Australia PA and Spouse','Australia','HYD',3,40000,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia PA and Spouse','Australia','KWT',6,1390,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia PA and Spouse','Australia','QTR',5,13900,1500,0,0,0,0,0,0,0,0,0,0],
['1008','Australia PR Application PA and Spouse Skill Assessment + Job Search','Australia','QTR',5,11000,0,15000,5000,5000,5000,15000,5000,3000,3000,4000,0],
['1008','Australia Single','Australia','AUH',7,9900,1500,4500,3000,1500,1500,6200,5300,0,0,0,0],
['1008','Australia Single','Australia','DXB',7,9900,1500,4500,3000,1500,1500,6200,5300,0,0,0,0],
['1008','Australia Single','Australia','HYD',3,100000,15000,40000,40000,25000,15000,65000,50000,0,0,0,15000],
['1008','Australia Single','Australia','KWT',6,890,90,500,250,150,100,650,600,0,0,0,0],
['1008','Australia Single','Australia','QTR',5,9900,1500,4500,3000,1500,1500,6200,5300,0,0,0,0],
['1008','Australia Single (Lawyer)','Australia','AUH',7,12000,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia Single (Lawyer)','Australia','DXB',7,12000,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia Single (Lawyer)','Australia','KWT',6,1000,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia Single (Lawyer)','Australia','QTR',5,12000,0,0,0,0,0,0,0,0,0,0,0],
['1008','Australia Single Application & Spouse Skill Assessment Only','Australia','AUH',7,12900,1500,0,0,0,0,8000,7000,0,0,0,0],
['1008','Australia Single Application & Spouse Skill Assessment Only','Australia','DXB',7,12900,1500,0,0,0,0,8000,7000,0,0,0,0],
['1008','Australia Single Application & Spouse Skill Assessment Only','Australia','QTR',5,12900,1500,0,0,0,0,8000,7000,0,0,0,0],
['1008','Australia Single PR + Job Search Assistance','Australia','DXB',7,15000,0,0,0,0,0,11000,9000,0,0,0,0],
['1008','Australia Single PR + Job Search Assistance','Australia','QTR',5,15000,0,0,0,0,0,11000,9000,0,0,0,0],
['1008','Australia Work Visa','Australia','AUH',7,0,0,0,0,0,0,5000,5000,5000,0,0,0],
['1008','Australia Work Visa','Australia','KWT',6,0,0,0,0,0,0,5000,5000,5000,0,0,0],
['1009','Australia Skill Assessment','Australia','AUH',7,5500,0,0,0,0,0,0,0,0,0,0,0],
['1009','Australia Skill Assessment','Australia','DXB',7,5500,0,0,0,0,0,0,0,0,0,0,0],
['1009','Australia Skill Assessment','Australia','HYD',3,60000,0,0,0,0,0,0,0,0,0,0,0],
['1009','Australia Skill Assessment','Australia','KWT',6,500,0,0,0,0,0,0,0,0,0,0,0],
['1009','Australia Skill Assessment','Australia','QTR',5,5500,0,0,0,0,0,0,0,0,0,0,0],
['1010','Australia Post Skill Assessment','Australia','AUH',7,5500,0,0,0,0,0,0,0,0,0,0,0],
['1010','Australia Post Skill Assessment','Australia','DXB',7,5500,0,0,0,0,0,0,0,0,0,0,0],
['1010','Australia Post Skill Assessment','Australia','HYD',3,60000,0,0,0,0,0,0,0,0,0,0,0],
['1010','Australia Post Skill Assessment','Australia','KWT',6,500,0,0,0,0,0,0,0,0,0,0,0],
['1010','Australia Post Skill Assessment','Australia','QTR',5,5500,0,0,0,0,0,0,0,0,0,0,0],
['1012','Global Talent Visa','Australia','AUH',7,15000,0,0,0,0,0,8000,4000,9000,0,0,0],
['1012','Global Talent Visa','Australia','DXB',7,15000,0,0,0,0,0,8000,4000,9000,0,0,0],
['1013','Visit Visa / Tourist Visa',null,'AUH',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1013','Visit Visa / Tourist Visa',null,'DXB',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1013','Visit Visa / Tourist Visa',null,'HYD',3,25000,0,0,0,0,0,0,0,0,0,0,0],
['1013','Visit Visa / Tourist Visa',null,'KWT',6,300,0,0,0,0,0,0,0,0,0,0,0],
['1013','Visit Visa / Tourist Visa',null,'QTR',5,3500,0,0,0,0,0,0,0,0,0,0,0],
['1014','Student Visa',null,'AUH',7,6000,0,0,0,0,0,3000,3000,0,0,0,0],
['1014','Student Visa',null,'DXB',7,6000,0,0,0,0,0,2500,2000,0,0,0,0],
['1014','Student Visa',null,'KWT',6,500,0,0,0,0,0,210,210,0,0,0,0],
['1014','Student Visa',null,'QTR',5,6000,0,0,0,0,0,2000,2000,0,0,0,0],
['1014','Student Visa',null,'HYD',3,35000,0,0,0,0,0,0,0,0,0,0,0],
['1015','Australia Job Search Assistance',null,'AUH',7,5000,0,0,0,0,0,0,0,0,0,0,0],
['1015','Australia Job Search Assistance',null,'DXB',7,5000,0,0,0,0,0,0,0,0,0,0,0],
['1015','Australia Job Search Assistance',null,'HYD',3,35000,0,0,0,0,0,0,0,0,0,0,0],
['1015','Australia Job Search Assistance',null,'KWT',6,450,0,0,0,0,0,0,0,0,0,0,0],
['1015','Australia Job Search Assistance',null,'QTR',5,5000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa',null,'DXB',7,10000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa',null,'QTR',5,10000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa',null,'AUH',7,10000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa',null,'KWT',6,890,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa',null,'HYD',3,50000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa','USA','AUH',7,12000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa','USA','DXB',7,12000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa','USA','HYD',3,100000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa','USA','KWT',6,1000,0,0,0,0,0,0,0,0,0,0,0],
['1016','Dependent Visa','USA','QTR',5,12000,0,0,0,0,0,0,0,0,0,0,0],
['1017','Visa Application',null,'DXB',7,5000,0,0,0,0,0,0,0,0,0,0,0],
['1017','Visa Application',null,'QTR',5,5000,0,0,0,0,0,0,0,0,0,0,0],
['1017','Visa Application',null,'AUH',7,5000,0,0,0,0,0,0,0,0,0,0,0],
['1017','Visa Application',null,'KWT',6,450,0,0,0,0,0,0,0,0,0,0,0],
['1017','Visa Application',null,'HYD',3,35000,0,0,0,0,0,0,0,0,0,0,0],
['1018','Business / Investor','Dominica','DXB',7,10500,0,0,0,0,0,5250,20000,99750,0,0,0],
['1018','Business / Investor','Ireland','DXB',7,10500,0,0,0,0,0,5250,20000,99750,0,0,0],
['1018','Dominica Citizenship','Dominica','DXB',7,113000,0,0,0,0,0,5000,18000,83000,0,0,0],
['1018','Portugal Golden Visa','Portugal','DXB',7,5000,0,0,0,0,0,6000,10000,133000,10217,0,0],
['1018','St. Kitts & Nevis','St. Kitts & Nevis','DXB',7,15800,0,0,0,0,0,0,0,0,0,0,0],
['1018','St. Lucia','St. Lucia','DXB',7,17850,0,0,0,0,0,6000,4690,25150,0,0,0],
['1018','St.Kitts & Nevis Citizenship','St. Kitts & Nevis','DXB',7,0,0,0,0,0,0,10000,21075,113675,0,0,0],
['1018','UK-Investor','United Kingdom','DXB',7,0,0,0,0,0,0,24086,24086,11675,0,0,0],
['1019','Resume Marketing Services',null,'AUH',7,0,0,0,0,0,0,3000,2000,3000,0,0,0],
['1019','Resume Marketing Services',null,'DXB',7,0,0,0,0,0,0,3000,2000,3000,0,0,0],
['1019','Resume Marketing Services',null,'HYD',3,0,0,0,0,0,0,50000,20000,30000,0,0,0],
['1019','Resume Marketing Services',null,'KWT',6,0,0,0,0,0,0,300,200,300,0,0,0],
['1019','Resume Marketing Services',null,'QTR',5,0,0,0,0,0,0,3000,2000,3000,0,0,0],
['1020','Nomad Visa','Spain','AUH',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1020','Nomad Visa','Spain','QTR',5,3500,0,0,0,0,0,0,0,0,0,0,0],
['1020','Nomad Visa','Thailand','AUH',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1020','Nomad Visa','Thailand','DXB',7,3500,0,0,0,0,0,0,0,0,0,0,0],
['1022','Germany Opportunity Card','Germany','AUH',7,5500,0,0,0,0,0,4000,3000,0,0,0,0],
['1022','Germany Opportunity Card','Germany','DXB',7,5500,0,0,0,0,0,4000,3000,0,0,0,0],
['1022','Germany Opportunity Card','Germany','HYD',3,100000,0,0,0,0,0,50000,50000,0,0,0,0],
['1022','Germany Opportunity Card','Germany','KWT',6,460,0,0,0,0,0,335,250,0,0,0,0],
['1022','Germany Opportunity Card','Germany','QTR',5,5500,0,0,0,0,0,4000,3000,0,0,0,0],
];

async function resolveBranchIds(connection) {
  const [rows] = await connection.query('SELECT id, abbrv FROM dm_branch');
  const byAbbrv = new Map(rows.map((r) => [r.abbrv, r.id]));
  const branchIds = {};
  for (const [key, abbrv] of Object.entries(BRANCH_ABBRV)) {
    if (!byAbbrv.has(abbrv)) throw new Error(`dm_branch row with abbrv "${abbrv}" not found (needed for ${key})`);
    branchIds[key] = byAbbrv.get(abbrv);
  }
  return branchIds;
}

async function ensureCountries(connection) {
  await connection.query("UPDATE dm_country_proces SET name = 'Czech Republic' WHERE name = 'Czec Republic'");

  const [existing] = await connection.query('SELECT id, name FROM dm_country_proces WHERE name IN (?)', [NEW_COUNTRIES]);
  const existingNames = new Set(existing.map((r) => r.name));
  for (const row of existing) COUNTRY[row.name] = row.id;

  const [[maxRow]] = await connection.query('SELECT MAX(id) as m FROM dm_country_proces');
  let nextId = maxRow.m + 1;
  for (const name of NEW_COUNTRIES) {
    if (existingNames.has(name)) continue;
    await connection.query('INSERT INTO dm_country_proces (id, name, sub_counteries, status) VALUES (?, ?, 0, 1)', [nextId, name]);
    COUNTRY[name] = nextId;
    nextId++;
  }
}

async function ensureServices(connection) {
  const uniqueSubCategories = [...new Set(FEE_ROWS.map((r) => r[1]))];
  const serviceIdByName = {};
  for (const name of uniqueSubCategories) {
    const [existing] = await connection.query('SELECT id FROM dm_service WHERE name = ? LIMIT 1', [name]);
    if (existing.length) {
      serviceIdByName[name] = existing[0].id;
      continue;
    }
    const [result] = await connection.query('INSERT INTO dm_service (name, status) VALUES (?, 1)', [name]);
    serviceIdByName[name] = result.insertId;
  }
  return serviceIdByName;
}

async function ensureCountryTypeProgramMappings(connection, serviceIdByName) {
  const pairs = new Map();
  for (const row of FEE_ROWS) {
    const [, subCategory, countryName] = row;
    if (!countryName) continue;
    const countryId = COUNTRY[countryName];
    const serviceId = serviceIdByName[subCategory];
    pairs.set(`${countryId}|${serviceId}`, { countryId, serviceId, typeId: classifyProgramType(subCategory) });
  }

  const [[maxRow]] = await connection.query('SELECT MAX(id) as m FROM dm_countries_type_program');
  let nextId = maxRow.m + 1;
  for (const { countryId, serviceId, typeId } of pairs.values()) {
    const [existing] = await connection.query(
      'SELECT id FROM dm_countries_type_program WHERE country = ? AND type = ? AND program = ?',
      [countryId, typeId, serviceId]
    );
    if (existing.length) continue;
    await connection.query(
      'INSERT INTO dm_countries_type_program (id, country, type, program, created, created_by) VALUES (?,?,?,?,NOW(),1)',
      [nextId, countryId, typeId, serviceId]
    );
    nextId++;
  }
}

async function seedFees(connection) {
  await ensureCountries(connection);
  const branchIds = await resolveBranchIds(connection);
  const serviceIdByName = await ensureServices(connection);
  await ensureCountryTypeProgramMappings(connection, serviceIdByName);

  // dm_fee is treated as a fully-managed reference table for these programs:
  // replace its contents each run so the seed stays the single source of truth.
  await connection.query('DELETE FROM dm_fee');

  let nextFeeId = 1;
  for (const row of FEE_ROWS) {
    const [, subCategory, countryName, branchKey, currencyId,
      upfront, profUp, m1, m2, m3, profMo, s1, s2, s3, s4, s5, profSt] = row;

    const serviceId = serviceIdByName[subCategory];
    const countryId = countryName ? COUNTRY[countryName] : null;
    const branchId = branchIds[branchKey];

    await connection.query(
      `INSERT INTO dm_fee (id, service, country, branch, currency, upfront, prof_fee,
        firstMonth, secondMonth, thirdMonth, prof_fee_month,
        firstStage, secondStage, thirdStage, forthStage, fifthStage, prof_fee_stage, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
      [nextFeeId, serviceId, countryId, branchId, currencyId, upfront, profUp,
        m1, m2, m3, profMo, s1, s2, s3, s4, s5, profSt]
    );
    nextFeeId++;
  }

  return { fees: FEE_ROWS.length, services: Object.keys(serviceIdByName).length };
}

async function run() {
  if (!database) throw new Error('DATABASE_URL must include a database name');
  const connection = await mysql.createConnection({ ...baseConfig, database });
  const result = await seedFees(connection);
  await connection.end();
  console.log(`Seeded ${result.fees} fee rows across ${result.services} services.`);
}

if (require.main === module) {
  run().catch((error) => {
    console.error('Fee seed failed:', error);
    process.exit(1);
  });
}

module.exports = { FEE_ROWS, COUNTRY, seedFees };
