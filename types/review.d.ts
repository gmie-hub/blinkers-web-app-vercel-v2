interface ReviewData {
  data: ReviewDatum[];
  total: number;
}

interface ReviewResponse extends Response {
  data: ReviewData;
}

interface ReviewDatum {
  business_id: string;
  user_id: number;
  rating: number;
  review: string;
  created_at: stringg;
  user?: UserData;
  from_user?: from_user;
}

interface from_user {
  name;
}
