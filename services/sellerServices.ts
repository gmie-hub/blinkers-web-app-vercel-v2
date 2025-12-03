import api from "@/lib/utils/apiClient";

export const FlagSellerApi = async (payload: Partial<FlagSeller>) => {
  return (await api.post("/sellers/flag/toggle", payload))?.data as Response;
};

export const getFlaggedSellerBySeller_idUser_id = async (
  user_id: number,
  seller_id: number
) => {
  return (
    await api.get(`sellers/flag?user_id=${user_id}&seller_id=${seller_id}`)
  )?.data as BusinessFollowersResponse;
};