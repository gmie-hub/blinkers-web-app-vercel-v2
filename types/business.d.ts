interface BusinessDetailsResponse extends Response {
  data: AllBusinessesDatum;
}

interface BusinessFollowersResponse extends Response {
  data: BusinessFollowersData;
}
interface BusinessFollowersData {
  data: FollowBusinessDatum[];
}

interface AllBusinessesData {
  current_page: number;
  data: AllBusinessesDatum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

interface AllBusinessesDatum {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: null;
  bio: null;
  about: null;
  address: null;
  city: null;
  state: null;
  country: null;
  website: null;
  instagram: null;
  facebook: null;
  whatsapp: null;
  status: string;
  business_status: string;
  category_id: number;
  user_id: null | number;
  claimed_by: null | number;
  assigned_at: null | string;
  created_at: string;
  updated_at: string;
  is_open: boolean;
  average_rating: number;
  total_rating: number;
  category: Category;
  business_hours: hour[];
  gallery: gallery[];
  logo: string;
  total_followers: number;
  average_rating: number;
  instagram: string;
  related_businesses: any;
  total_ads: number;
}

interface FollowBusiness {
  business_id: number;
  user_id: number;
  action: string;
}

interface gallery {
  business_id: number;
  created_at: string;
  id;
  number;
  type: string;
  url: string;
}

interface BusinessHourDatum {
  business_id?: number;
  hours?: hour[];
}

interface BusinessStatResponse extends Response {
  data: BusinessHourDatum;
}

interface hour {
  day: string;
  open_time: string;
  close_time;
  string;
}
