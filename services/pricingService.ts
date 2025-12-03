import api from "@/lib/utils/apiClient";

export const getAllSubscription = async () => {
  return (await api.get(`plans`))?.data as any;
};

export const getAllSubscriptionById = async (id: number) => {
  return (await api.get(`plans/${id}`))?.data as PlanDatumResponse;
};