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
