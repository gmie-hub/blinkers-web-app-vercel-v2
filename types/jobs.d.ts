
interface CoverLetter {
  id: number;
  CoverLetter: string;
  UploadCoverLetter: FIle | any;
}
interface Education {
  id: number;
  // Instituition: string;
  // Degree: string;
  // FieldStudy: string;
  Grade: string;
  // StartDate:string;
  // EndDate:string;
  studying: string;

  institution: string;
  start_date: string;
  field_of_study: string;
  end_date: string;
  degree: string;
}

interface Payload {
  skills?: SkillsData[];
  jobLink?: LinkData[];
  Education?: Education[];
  EmpHistory?: EmploymentHistory[];
  coverLetter?: any;
}

interface SkillsData {
  id: number;
  skills: string;
}

interface LinkData {
  id: number;
  type: string;
  url: string;
}

interface Education {
  id: number;
  // Instituition: string;
  // Degree: string;
  // FieldStudy: string;
  Grade: string;
  // StartDate:string;
  // EndDate:string;
  studying: string;

  institution: string;
  start_date: string;
  field_of_study: string;
  end_date: string;
  degree: string;
}
interface EmploymentHistory {
  id: number;
  // JobTitle: string;
  // JobType: string;
  // CompanyName: string;
  // Location: string;
  employment_type: string;
  // StartDate:string;
  // EndDate:string;
  summary: string;
  current_work: string;

  company_name: string;
  end_date: string;
  job_title: string;
  job_type: string;
  location: string;
  start_date: string;
}

interface LinkData {
  id: number;
  type: string;
  url: string;
}
interface SkillsData {
  id: number;
  skills: string;
}

interface JobResponse extends Response {
  data: JobData;
}
interface JobData {
  data: JobDatum[];
  total: number;
}

interface JobDetailsResponse extends Response {
  data: JobDatum;
}
interface JobDatum {
  title: string;
  business_id: number;
  status: string;
  employment_type: string;
  job_type: string;
  level: string;
  industry_id: string;
  is_admin: boolean;
  is_open: boolean;
  location: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  benefits: string;
  id: number;
  start_date: string;
  end_date: string;
  total_applicant: number;
  business: AllBusinessesDatum;
  renumeration: string;
  created_at: string;
  applicant: Applicant;
  total_flags: number;
  business: Business;
  total_feedbacks: number;
  related_jobs: RelatedJobData[];
  user:UserData
  
}

interface FlagJob {
  job_id: string;
  applicant_id: stirng;
  action: string;
  reason: string;
}

interface FlagJob {
  job_id: string;
  applicant_id: stirng;
  message: string;
  user_id:number
}

interface IndustriesDatum {
  name: string;
  id: number;
  created_at:string;
  updated_at:string;
}

interface ApplicDetailsResponse {
  message: string;
  status: boolean;
  data: JobApplication;
  
}


interface JobApplication {
  id: number;
  job_id: number;
  applicant_id: number;
  business_id: number;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
  applicant: Applicant;
  job:JobDatum
  business:AllBusinessesDatum
  related_jobs:JobDatum[]
}
interface ApplicantResponse {
  message: string;
  status: boolean;
  data: JobApplicationData;
  
}
interface JobApplicationData {
  current_page: number;
  data: JobApplication[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  applicant:Applicant,
 
}

interface Applicant {
  id: number;
  user_id: number;
  cv_url: string;
  cover_letter_url: string;
  specialization: string;
  education?: Education[];
  employment_history?: EmploymentHistory[];
  links?: Link[];
  created_at: string;
  updated_at: string;
  skills;
  user?: UserLogin;
  industries?:IndustriesData
  preferred_location:string;
}

