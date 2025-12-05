interface ApplicationStatusPayload {
  status: string; 
  message? :string
}
interface ReplyReviewPayload {
  status?: string;
  owner_comment?: string;
}
interface AdsStatusPayload {
  status: string;

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
interface ChangePassword {
  current_password:string
  password: string;
  confirm_password:string;
}