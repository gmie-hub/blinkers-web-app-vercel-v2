import api from "@/lib/utils/apiClient";

export const getUserNotifications = async (id?: number, hasRead?: number, channel?:string,page?:number) => {
  const queryParams = new URLSearchParams();

  if (id !== undefined) {
    queryParams.append("user_id", id.toString());
  }
 

  if (page !== undefined) {
    queryParams.append("page", page.toString());
  }

  if (hasRead !== undefined) {
    queryParams.append("is_read", hasRead.toString());
  }
  if (channel !== undefined) {
    queryParams.append("channel", channel.toString());
  }

  const queryString = queryParams.toString();
  return (await api.get(`/user-notifications?${queryString}`))?.data;
};

export const getUserNotificationById = async (userId?:number, id?: number,) => {
  return (await api.get(`user-notifications?user_id=${userId}&id=${id}`))?.data ;
};

export const ReadNotification = async (payload: any) => {
  return (await api.post("user-notifications/read", payload, {}))?.data ;
};

export const deleteAds = async ({ id }: { id: number }) => {
  return (await api.delete(`ads/${id}`))?.data as ProductDatum;
};
