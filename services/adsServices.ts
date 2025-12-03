import api from "@/lib/utils/apiClient";

export const AddToFav = async (payload: Partial<AddToFav>) => {
  return (await api.patch("ads/set-fav", payload, {}))?.data;
};

export const getAllFav = async (user_id?: number) => {
  return (await api.get(`/ads/fav?user_id=${user_id}`))?.data;
};

export const getAllPopularMarket = async (page: number, per_page: number) => {
  return (await api.get(`/ads/popular?page=${page}&per_page=${per_page}`))
    ?.data as any;
};

export const getProductDetails = async (id: number) => {
  return (await api.get(`ads/${id}`))?.data as ProductDetailsResponse;
};

export const getProductDetailsByslug = async (slug: string) => {
  return (await api.get(`ads/slug/${slug}`))?.data as ProductDetailsResponse;
};

export const getAdsByUserId = async (user_id: number, page: number) => {
  return (await api.get(`/ads?user_id=${user_id}&page=${page}&per_page=${50}`))
    ?.data as AllProductaResponse;
};

export const getTrendingAds = async (city?: string, state?: string) => {
  const params = new URLSearchParams();

  if (city) params.append("city", city);
  if (state) params.append("state", state);

  const query = params.toString();
  const url = query
    ? `ads/trending?${query}&per_page${50}`
    : `ads/trending?per_page${50}`;

  return (await api.get(url))?.data;
};

export const getRecommededAds = async () => {
  return (await api.get(`/recommendations?type=${"ads"}`))?.data;
};

export const getPromotedAds = async () => {
  return (await api.get(`/banners`))?.data ;
};

export const getPromotedAdsById = async (id?:number) => {
  return (await api.get(`/banners/${id}`))?.data ;
};