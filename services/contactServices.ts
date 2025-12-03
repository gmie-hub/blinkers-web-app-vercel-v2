import api from "@/lib/utils/apiClient";

export const ContactUsApi = async (payload: Partial<ContactUs>) => {
  return (await api.post("contact-us", payload, {}))?.data ;
};