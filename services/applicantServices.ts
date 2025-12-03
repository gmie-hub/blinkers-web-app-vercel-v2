import api from "@/lib/utils/apiClient";

export const getApplicantsbyId = async (id: number) => {
  return (await api.get(`/users/profile?user_id=${id}`))
    ?.data as UserDataResponse;
};