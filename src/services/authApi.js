import { apiClient } from "./apiClient";
import { sanitizeUserPayload } from "./userService";

/**
 * REGISTER
 * response:
 * {
 *   message: string,
 *   email: string,
 *   otpExpiredAtUtc: string
 * }
 */
export async function register({
  fullName,
  email,
  password,
  phone,
  city,
  gender,
}) {
  const res = await apiClient.post("/auths/register", {
    fullName,
    email,
    password,
    phone,
    city,
    gender,
  });

  return res.data;
}

/**
 * CONFIRM OTP
 * response:
 * {
 *   accessToken: string,
 *   expiresAtUtc: string,
 *   user: {...}
 * }
 */
export async function confirmOtp({ email, otp }) {
  const res = await apiClient.post("/auths/confirm-otp", {
    email,
    otp,
  });

  const data = res.data;
  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }

  return {
    ...data,
    user: sanitizeUserPayload(data.user),
  };
}

/**
 * RESEND OTP
 */
export async function resendOtp({ email }) {
  const res = await apiClient.post("/auths/resend-otp", {
    email,
  });

  return res.data;
}

/**
 * LOGIN
 */
export async function login({ identifier, password }) {
  const res = await apiClient.post("/auths/login", {
    identifier,
    password,
  });

  const data = res.data;

  if (!data?.accessToken || !data?.user) {
    throw new Error("API trả về dữ liệu không hợp lệ (thiếu accessToken/user)");
  }

  return {
    ...data,
    user: sanitizeUserPayload(data.user),
  };
}
