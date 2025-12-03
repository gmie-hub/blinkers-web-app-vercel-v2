import { atomWithStorage } from "jotai/utils";
import {
  BasicInfo,
  CoverLetter,
  Education,
  EmploymentHistory,
  LinkData,
  Route,
  RoutesPart,
  SkillsData,
  SocialInfo,
} from "./type";
import { routeParts } from "../routes";

const educationInfo = JSON.parse(
  localStorage.getItem("education-info") ?? "[]"
);
const empHistoryInfo = JSON.parse(
  localStorage.getItem("employment-History") ?? "[]"
);
const coverLetterInfo = JSON.parse(
  localStorage.getItem("cover-letter") ?? "{}"
);
const skillData = JSON.parse(localStorage.getItem("skill-data") ?? "[]");
const linkDataInfo = JSON.parse(localStorage.getItem("link-data") ?? "[]");

const socialInfo = JSON.parse(localStorage.getItem("social-info") ?? "{}");
const routes = JSON.parse(localStorage.getItem("routes") ?? "[]");
const routesParts = JSON.parse(
  localStorage.getItem("route-part") ?? JSON.stringify(routeParts)
);
const basicInfo = JSON.parse(localStorage.getItem("basic-info") ?? "{}");

export const EducationInfoAtom = atomWithStorage<Education[]>(
  "education-info",
  educationInfo
);

export const EmploymentHistoryInfoAtom = atomWithStorage<EmploymentHistory[]>(
  "employment-History",
  empHistoryInfo
);

export const CoverLetterInfoAtom = atomWithStorage<CoverLetter>(
  "cover-letter",
  coverLetterInfo
);
export const SkilsInfoAtom = atomWithStorage<SkillsData[]>(
  "skill-data",
  skillData
);

export const LinkInfoAtom = atomWithStorage<LinkData[]>(
  "link-data",
  linkDataInfo
);

export const basicInfoAtom = atomWithStorage<BasicInfo>(
  "basic-info",
  basicInfo
);

export const socialInfoAtom = atomWithStorage<SocialInfo>(
  "social-info",
  socialInfo
);
export const routesArrayAtom = atomWithStorage<Route[]>("routes", routes);
export const routesPartsAtom = atomWithStorage<RoutesPart>(
  "route-part",
  routesParts
);

export type BusinessClaim = {
  approved_at: string | null;
  approved_by: string | null;
  business_id: number;
  created_at: string;
  doc_url: string;
  id: number;
  message: string;
  rejection_reason: string | null;
  secondary_doc_url: string | null;
  status: string;
  updated_at: string;
  user_id: number;
};

export interface UserData {
  data: UserLogin;
  // message: string;
}

export interface UserLogin {
  address?: string;
  address_lat?: string;
  address_long?: string;
  apple_id?: string;
  business: AllBusinessesDatum;
  business_claim?: BusinessClaim;
  claim_status?: string;
  country_code: string;
  created_at: string;
  dob?: string;
  date_of_birth?: string;
  email: string;
  email_token: string;
  email_token_status: number;
  email_unverified_until?: string;
  email_verified_at?: string;
  facebook_address?: string;
  facebook_id?: string;
  google_id?: string;
  id: number;
  instagram_address?: string;
  isManageInterestSaved: boolean;
  is_applicant: boolean;
  is_email_verified: string;
  is_login: string;
  is_password_changed: string;
  last_login?: string;
  local_government_area_id?: string;
  name: string;
  number: string;
  profile_image?: string;
  register_method: string;
  remember_token?: string;
  role: string;
  security_token: string;
  seller_created_at?: string;
  slug?: string;
  social_login: string;
  state_id?: string;
  status: string;
  store_bio?: string;
  store_name?: string;
  token: string;
  twitter_address?: string;
  updated_at: string;
  website_address?: string;
  applicantId?: number;
  applicant?: Applicant;
  follower_id?: number;
}

export const userAtom = atomWithStorage<UserLogin | undefined | null>(
  "blinkers-web&site#",
  JSON.parse(localStorage.getItem("blinkers-web&site#")!) ?? undefined
);
