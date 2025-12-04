interface Props {
  backgroundImage?: string;
  children?: React.ReactNode;
}

interface Response {
  statusCode: number;
  message: string;
  data:any ;
}

interface signUp {
  name: string;
  country_code: string;
  number: string;
  address: string;
  address_lat: string;
  address_long: string;
  email: string;
  password: string;
  confirm_password: string;
  register_method:string;
  referral_code?:string
}



interface LoginPayload {
  value: string;
  password: string;
  device_type:string;
  device_id:string;
}
interface ForgotPasswordPayload {
  email_or_number?: string;
  value:string;
  number?:number
}
interface ResetPasswordPayload {
  email: string;
  password:string;
  confirm_password:number
}

interface resendOtp {
  type?: string;
  value:string;
  from_page:string;
  route?:string;
}
interface UserVerifyOtp {
  otp?: number;
  pin_id?:string;
  // is_email?:string
}
interface SellerSignUpData{
  name:string
number?:string;
email:string;
address:string;
address_lat:string;
address_long:string

store_name:string

store_bio:string
state_id:number;
local_government_area_id:number;
profile_image:string;
facebook_address:string;
instagram_address:string;
twitter_address:string
website_address:string
}