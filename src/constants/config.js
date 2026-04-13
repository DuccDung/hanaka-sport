export const API_TIMEOUT = 15000;

const PROD_API_BASE_URL = "https://hanakasport.click";
const PROD_WS_BASE_URL = "wss://hanakasport.click";
// const PROD_API_BASE_URL = "http://192.168.110.228:5062";
// const PROD_WS_BASE_URL = "ws://192.168.110.228:5062";
const ENV = typeof process !== "undefined" && process.env ? process.env : {};

export const API_BASE_URL = ENV.EXPO_PUBLIC_API_BASE_URL || PROD_API_BASE_URL;
export const WS_BASE_URL = ENV.EXPO_PUBLIC_WS_BASE_URL || PROD_WS_BASE_URL;

export const STORAGE_KEYS = {
  accessToken: "accessToken",
  expiresAtUtc: "expiresAtUtc",
  user: "user",
};
