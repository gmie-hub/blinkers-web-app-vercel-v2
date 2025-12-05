import api from "@/lib/utils/apiClient";

export const FollowBusiness = async (payload: Partial<FollowBusiness>) => {
  return (await api.post("business/followers/toggle", payload, {}))
    ?.data ;
};

export const FollowSeller = async (payload: Partial<FollowBusiness>) => {
  return (await api.post("followers/handle-action", payload, {}))?.data ;
}

export const getBusinessById = async (id: number) => {
  return (await api.get(`/businesses/${id}`))?.data as BusinessDetailsResponse;
};

export const getFollowersByUser_id = async (
  follower_id: number,
  user_id?: number
) => {
  return (
    await api.get(`followers?follower_id=${follower_id}&user_id=${user_id}`)
  )?.data as BusinessFollowersResponse;
};

export const getFollowersByBusiness_id = async (
  user_id: number,
  business_id: number
) => {
  // return (await api.get(`business/followers?business_id=${business_id}`))
  return (
    await api.get(
      `business/followers?user_id=${user_id}&business_id=${business_id}`
    )
  )?.data as BusinessFollowersResponse;
};

export const ClaimBusinessApi = async (payload: FormData) => {
  return (
    await api.post("/business/claims", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};

export const getAllBusiness = async (
  search?: number | string,
  page?: number
) => {
  let url = `/businesses`;

  const params = new URLSearchParams();

  if (search !== undefined && search !== null && `${search}`.trim() !== "") {
    params.append("search", `${search}`);
  }

  if (page !== undefined) {
    params.append("page", `${page}`);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return (await api.get(url))?.data;
};

export const getTopBusiness = async () => {
  return (await api.get(`/businesses?top=${1}`))?.data ;
};

export const getRecommentationBusiness = async () => {
  return (await api.get(`/recommendations?type=${'businesses'}`))?.data ;
};