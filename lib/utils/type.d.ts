import { UploadFile } from "antd";

interface Education {
  id:number;
  // Instituition: string;
  // Degree: string;
  // FieldStudy: string;
    Grade: string;
  // StartDate:string;
  // EndDate:string;
  studying:string;


  institution:string;
  start_date:string;
  field_of_study:string;
  end_date:string;
  degree:string;
}
interface EmploymentHistory {
  id:number;
  // JobTitle: string;
  // JobType: string;
  // CompanyName: string;
  // Location: string;
  employment_type:string;
  // StartDate:string;
  // EndDate:string;
  summary:string
  current_work:string


  company_name:string;
  end_date:string;
  job_title:string;
  job_type:string;
  location:string;
  start_date:string

}
interface CoverLetter {
  id:number;
  CoverLetter: string;
  UploadCoverLetter: FIle | any;
}
interface SkillsData {
  id:number;
  skills: string;

}


interface LinkData {
  id:number;
  type: string;
  url: string;


}


interface SocialInfo {
  facebook: string;
  instagram: string;
  whatsapp: string;
  logo: UploadFile | any;
}
export interface Route {
  name: string;
  route: string;
  params: string;
  isRoot?: boolean;
}

interface RoutesPart {
  [x: string]: {
    route: string;
    name: string;
    params?: string;
  };
}

interface BasicInfo {
  businessName: string;
  businessAddress: string;
  category: strng | number;
  phoneNumber: string;
  email: string;
  website: string;
  aboutBusiness: string;
}