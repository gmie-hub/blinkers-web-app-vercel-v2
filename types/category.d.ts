interface CategoryResponse extends Response {
  data: CategoryData;
}

interface CategoryData {
  current_page: number;
  data: CategoryDatum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

interface CategoryDatum {
  specifications: any;
  id: number;
  slug: string;
  title: string;
  image: string;
  resize_image: string;
  created_at: string;
  updated_at: string;
}
