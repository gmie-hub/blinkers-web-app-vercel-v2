interface AddToFav {
  add_id: string;
  status: number;
  id: number;
}

interface ProductDetailsResponse extends Response {
  data: ProductDatum;
}

interface AllProductaResponse extends Response {
  data: AllProductData;
}

interface AllProductData {
  current_page: number;
  data: ProductDatum[];
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

interface ProductDatum {
  subcategory: CategoryDatum;
  specification_values: any;
  data?: any;
  favCreatedAt: string;
  category: CategoryDatum;
  business_id?: number | null;
  category_id: number;
  cost_price?: string | null;
  created_at: string;
  description: string;
  description_tags?: string[];
  discount_price?: string | null;
  from_date?: string | null;
  id: number;
  isFavourite: boolean;
  is_admin_ad: number;
  local_government_area_id?: number | null;
  pickup_address: string;
  pickup_lat: string;
  pickup_lng: string;
  price: string | number;
  seller_email?: string | null;
  seller_info?: string | null;
  slug: string;
  state_id?: number | null;
  status: number;
  sub_category_id?: number | null;
  technical_details?: string | null;
  title: string;
  to_date?: string | null;
  updated_at: string;
  url?: string | null;
  user_id: number;
  local_govt: local_govt;
  state: state;
  add_images: add_imagesDatum[];
  related_ads: RelatedProduct[];
  user: UserData;
  views: number;
  averageRating: string;
  user_id: number;
  add_videos: add_imagesDatum[];
  cover_image_url: string;
  image_url: string;
  average_rating: string;
  total_rating: string;
}

interface RelatedProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price: number;
  add_images: add_imagesDatum[];
  created_at: string;
  local_govt?: local_govt;
  state?: state;
  user_id: number;
  slug: string;
}

interface local_govt {
  id: number;
  local_government_area: string;
}

interface state {
  id: number;
  state_name: string;
}

interface add_imagesDatum {
  add_image: string;
  add_id: number;
  id: number;
  is_featured: number;
  image_url: string;
  add_video: string;
}
