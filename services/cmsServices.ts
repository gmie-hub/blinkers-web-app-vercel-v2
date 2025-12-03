import api from "@/lib/utils/apiClient";

export const getAllCms = async () => {
  return (await api.get(`cms`))?.data as CmsResponse ;
};