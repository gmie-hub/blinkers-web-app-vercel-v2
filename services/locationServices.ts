import api from "@/lib/utils/apiClient";

export const getAllState = async () => {
  return (await api.get(`states?per_page=${40}`))?.data as StateResponse;
};

export const getLGAbyStateId = async (stateId: number) => {
  return (await api.get(`local-govt?state_id=${stateId}`))?.data as LGAResponse;
};