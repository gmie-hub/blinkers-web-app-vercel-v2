import api from "@/lib/utils/apiClient";

export const SignUpCall = async (payload: Partial<signUp>) => {
  return (await api.post("/auth/register", payload))?.data as Response;
};
export const SellerSignUpCall = async (payload: Partial<signUp>) => {
  return (await api.post("/users/complete", payload))?.data as Response;
};
export const ResetPasswordCall = async (payload: Partial<ResetPasswordPayload>) => {
  return (await api.post("/auth/reset-password", payload))?.data as Response;
};


export const LoginApiCall = async (data: LoginPayload) => {
  return (await api.post("/auth/login", data))?.data as any;
};

export const ForgotPasswordCall = async (email: string) => {
  return (await api.post(`/auth/forgot-password?value=${email}`))
    ?.data as Response;
};

export const ResendOptCall = async (data: resendOtp) => {
  return (await api.post("/auth/resend-otp", data))?.data as Response;
};

export const userVerifyOtp = async (data: UserVerifyOtp) => {
  return (await api.post("/auth/verify-otp", data))?.data as Response;
};


