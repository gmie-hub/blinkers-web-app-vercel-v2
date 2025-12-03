import axios, { AxiosInstance } from "axios";
// import { logout } from "./logout";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  env: {
    // The FormData class to be used to automatically serialize the payload into a FormData object
    FormData: globalThis?.FormData,
  },
});

// Set up axios request interceptors
api.interceptors.request.use(
  function (config) {
    let token = "";

    if (typeof (config?.headers as any).authorization === "undefined") {
      const tokenModel = JSON.parse(
        localStorage.getItem("blinkers-web&site#") || "{}"
      );

      if (tokenModel?.security_token) {
        token = tokenModel?.security_token;

      }
    }
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...config.headers,
    } as any;

    return config;
  },
  function (error: any) {
    if (getOnlineStatus() === "offline") {
      error = {
        message:
          "You are currently offline. Kindly turn on your network or try again",
      };
      return Promise.reject(error);
    }
  }
);
api.interceptors.response.use(null, function (error) {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    // logout()
    console.log('token')
  }

  return Promise.reject(error);
});

function getOnlineStatus() {
  return navigator.onLine ? "online" : "offline";
}

window.addEventListener("offline", getOnlineStatus);
window.addEventListener("online", getOnlineStatus);

export default api;
