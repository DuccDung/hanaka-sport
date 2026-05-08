import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../constants/config";
import { getAuthSession, clearStoredAccountData } from "./authStorage";
import { clearRealtimeAccountState } from "./realtimeService";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

function hasHeader(headers, name) {
  if (!headers) return false;

  if (typeof headers.has === "function") {
    return headers.has(name);
  }

  if (typeof headers.get === "function") {
    return !!headers.get(name);
  }

  const target = name.toLowerCase();
  return Object.keys(headers).some(
    (key) => key.toLowerCase() === target && !!headers[key],
  );
}

function setHeader(headers, name, value) {
  if (typeof headers.set === "function") {
    headers.set(name, value);
    return;
  }

  headers[name] = value;
}

function removeHeader(headers, name) {
  if (!headers) return;

  if (typeof headers.delete === "function") {
    headers.delete(name);
    return;
  }

  const target = name.toLowerCase();
  Object.keys(headers).forEach((key) => {
    if (key.toLowerCase() === target) {
      delete headers[key];
    }
  });
}

apiClient.interceptors.request.use(async (config) => {
  const skipAuth = config.skipAuth === true;
  const headers = config.headers || {};

  delete config.skipAuth;

  if (skipAuth) {
    removeHeader(headers, "Authorization");
    config.headers = headers;
    return config;
  }

  const session = await getAuthSession();
  if (session?.accessToken && !hasHeader(headers, "Authorization")) {
    setHeader(headers, "Authorization", `Bearer ${session.accessToken}`);
  }

  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await clearRealtimeAccountState();
      await clearStoredAccountData();
    }
    return Promise.reject(error);
  },
);
