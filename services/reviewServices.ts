import api from "@/lib/utils/apiClient";

export const getAllReviews = async (id: string, page?: number) => {
  const url = page
    ? `business/reviews?business_id=${id}&page=${page}&per_page=${5}`
    : `business/reviews?business_id=${id}&per_page=${5}`;

  return (await api.get(url))?.data as ReviewResponse;
};

export const getAllSellerReviews = async (id: string, page?: number) => {
  const url = page
    ? `reviews/user?to_user_id=${id}&page=${page}&per_page=${5}`
    : `reviews/user?to_user_id=${id}&per_page=${5}`;

  return (await api.get(url))?.data as ReviewResponse;
};

export const WriteReviewApi = async (payload: Partial<ReviewDatum>) => {
  return (await api.post("business/reviews", payload, {}))?.data;
};

export const WriteSellerReviewApi = async (payload: Partial<ReviewDatum>) => {
  return (await api.post("reviews/user", payload, {}))?.data;
};
