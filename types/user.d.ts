interface UserData {
  total_all_ads:number,
  subscription: any;
  plan_name:string;
  id: string | number;
  name: string;
  slug: string | null;
  email: string;
  number: string;
  address: string;
  address_lat: string;
  address_long: string;
  apple_id: string | null;
  business: any;
  business_claim: string | null;
  claim_status: string | null;
  country_code: string;
  created_at: string;
  dob: string | null;
  date_of_birth?:string;
  email_token: string;
  email_token_status: number;
  email_unverified_until: string;
  email_verified_at: string | null;
  facebook_address: string | null;
  facebook_id: string | null;
  google_id: string | null;
  instagram_address: string | null;
  is_applicant: boolean;
  is_email_verified: string;
  is_login: string;
  is_password_changed: string;
  last_login: string;
  local_government_area_id: number | null;
  profile_image: string | null | any;
  register_method: string;
  remember_token: string | null;
  role: string;
  seller_created_at: string | null;
  social_login: string;
  state_id: number | null;
  status: string;
  store_bio: string | null;
  store_name: string | null;
  token: string;
  twitter_address: string | null;
  updated_at: string;
  website_address: string | null;
  applicant?: Applicant;
  total_ads:number ;
  industries:any;
  total_followers:number;
  total_ads:number;
  total_rating:number;
  whatsapp_address:string;
  preferred_location:string;
}

interface UserDataResponse extends Response {
  data: UserData;
  message: string;
}