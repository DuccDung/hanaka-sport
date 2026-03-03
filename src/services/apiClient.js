import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../constants/config";
import { getAuthSession, clearAuthSession } from "./authStorage";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getAuthSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Optional: nếu API trả 401 thì auto logout
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await clearAuthSession();
    }
    return Promise.reject(error);
  },
);
