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
